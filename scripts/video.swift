// Makes a screen recording ready for the site: scaled to a width, H.264 with no sound, the moov
// atom up front so it starts playing at once, and a poster frame as JPEG.
//
//   swift scripts/video.swift <in.mp4|mov> <out.mp4> <width> <poster.jpg> [posterSeconds] [bitrate]
//
// Nothing is retouched: the frames are the recording's own, only resized and re-encoded.
import AVFoundation
import CoreImage
import Foundation
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count >= 5, let width = Int(args[3]) else {
  print("usage: video.swift in out width poster.jpg [posterSeconds] [bitrate]")
  exit(1)
}
let src = URL(fileURLWithPath: args[1])
let dst = URL(fileURLWithPath: args[2])
let posterURL = URL(fileURLWithPath: args[4])
let posterAt = args.count > 5 ? Double(args[5]) ?? 0 : 0
let bitrate = args.count > 6 ? Int(args[6]) ?? 2_400_000 : 2_400_000

let asset = AVURLAsset(url: src)
let sem = DispatchSemaphore(value: 0)

Task {
  do {
    guard let track = try await asset.loadTracks(withMediaType: .video).first else { throw NSError(domain: "video", code: 1) }
    let natural = try await track.load(.naturalSize)
    let transform = try await track.load(.preferredTransform)
    let fps = try await track.load(.nominalFrameRate)
    let size = natural.applying(transform)
    let w = width
    var h = Int((abs(size.height) * CGFloat(width) / abs(size.width)).rounded())
    h -= h % 2

    // the poster: one frame, as JPEG
    let gen = AVAssetImageGenerator(asset: asset)
    gen.appliesPreferredTrackTransform = true
    gen.maximumSize = CGSize(width: w, height: h)
    gen.requestedTimeToleranceBefore = .zero
    gen.requestedTimeToleranceAfter = .zero
    let (cg, _) = try await gen.image(at: CMTime(seconds: posterAt, preferredTimescale: 600))
    let destination = CGImageDestinationCreateWithURL(posterURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(destination, cg, [kCGImageDestinationLossyCompressionQuality: 0.82] as CFDictionary)
    CGImageDestinationFinalize(destination)

    // the video: read frames, write them scaled, H.264, no audio
    try? FileManager.default.removeItem(at: dst)
    let reader = try AVAssetReader(asset: asset)
    let output = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
    reader.add(output)
    let writer = try AVAssetWriter(outputURL: dst, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
      AVVideoCodecKey: AVVideoCodecType.h264,
      AVVideoWidthKey: w,
      AVVideoHeightKey: h,
      AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
      AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: bitrate,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoExpectedSourceFrameRateKey: fps > 0 ? fps : 30,
        AVVideoMaxKeyFrameIntervalKey: 30,
      ],
    ])
    input.expectsMediaDataInRealTime = false
    input.transform = transform
    writer.add(input)
    reader.startReading()
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)
    let queue = DispatchQueue(label: "video")
    await withCheckedContinuation { (done: CheckedContinuation<Void, Never>) in
      input.requestMediaDataWhenReady(on: queue) {
        while input.isReadyForMoreMediaData {
          if let sample = output.copyNextSampleBuffer() {
            input.append(sample)
          } else {
            input.markAsFinished()
            done.resume()
            return
          }
        }
      }
    }
    await writer.finishWriting()
    if writer.status != .completed { throw writer.error ?? NSError(domain: "video", code: 2) }
    let bytes = (try? FileManager.default.attributesOfItem(atPath: dst.path)[.size] as? Int) ?? 0
    print("\(dst.lastPathComponent): \(w)×\(h), \(bytes / 1024) KB; poster \(posterURL.lastPathComponent)")
  } catch {
    print("error: \(error)")
    exit(2)
  }
  sem.signal()
}
sem.wait()
