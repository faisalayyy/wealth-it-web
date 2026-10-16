# Jeton spec notes (desktop 1440x900; page height 12419)
Stack: Nuxt, GSAP 3.12.5 (+ScrollTrigger), Lenis 1.0.42. Font: Sequel Sans Display 400/450(book)/500(medium)/600. Body 16px ls .03em.
Grid: 16 cols; --grid-gap clamp(4px,-1.967px+1.53vw,24px); --grid-margin clamp(16px,2.896px+3.36vw,60px); breakpoints: 743 (xs), 1023 (sm), 1290 (md), 2000+ (vw scaling).
Type: title-1 clamp(56,19.067+9.47vw,180) lh.9 | title-2 clamp(48,26.55+5.5vw,120) lh1 | title-3 clamp(40,28.105+3.05vw,80) lh1 ls.01em | title-4 clamp(32,22.484+2.44vw,64) lh1.1 | title-5 clamp(27,20.76+1.6vw,48) lh1.2 | body 16/1.5 | body-small 14/1.4 | caption 12/1.5 ls .03em. subhead-2 ~23px @1440.
Colors: orange #F73B20, menu-bar #F84D35, orange-25 #FFF6F5, orange-900 #360802, mobile-app-hero bg #6B3843, drawer thumb #F96853.
Page order: fixed bottom menu (_menu) | abs top navbar (logo left 114x32; lang+login+signup right) | common-header hero 100svh | _hero-introduction (header 200vh sticky title+5 snippets; margin-bottom -40vh; taglines Add/Send/Exchange sticky) | _jeton-walkthrough 900 pinned 5 steps | _mobile-app-hero 1249 (#6B3843) | _jeton-card-overview (my-180-64) | _currency-exchange-calculator (canvas bg) | _client-testimonials (orange, stacked cards) | _extra-bold-hero (grid-stack two layers white/orange) | footer (links 5 cols, externals, divider, lang, giant wordmark, legal, partnership cards).

## Hero (CommonHeader)
- bg: orange + looping video (3D stacked translucent discs on coral gradient), video opacity 0->1 transition 1.2s ease-out on load; bg scale 1.1; yPercent 0->15 scrub top top -> bottom top.
- the video (one portrait 1440x2160 file at every width, object-fit cover) is two identical 6.675s loops. One stack of ~12 coins hangs from an anchored coin at the top right. By loop position: 0 fully out and bent into an S (middle coins edge-on); .25 straight column; .43 folding shut; .5 a single coin, held a beat; .58–.66 paying out again, fanning from a hinge on the right; .8 out, bending back into the S. Coins close up at their inner edges but never pass through one another. The site's hero departs from this at the owner's request: its coins travel round a ring instead (see `src/three/discs.ts`).
- main-row: min-height 100svh; padding-top var(--120); padding-bottom clamp(116px,108.863+1.83vw,140px) (80 below 1024). Left col xxl-8 md-9 sm-12 xs-16 justify-end: h1 title-2 -medium (105.75px@1440). Right col xxl-4 offset-3 (md-6 off-1, sm-8, xs-16) justify-end mb-12: p subhead-2 -medium + ctas mt-32 gap-24 (app buttons 148x44 outline).
- title intro: chars from {yPercent:105, rotate:3} dur .8 stagger .01 ease power3 (chars clipped: .c overflow hidden, padding-bottom .15em, margin-bottom -.15em).
- scroll hint: bottom 42px left grid-margin; caption; bg rgba(255,255,255,.1) border 1px rgba(255,255,255,.1) radius 5em padding .4em .85em; coin-drop icon (6 spans, 2s loop staggered .333s); hidden <1024. click -> scroll to next section power1.inOut.

## Hero introduction
- header height 200vh; margin-bottom -40vh; sticky-slot 100vh top 0. h2 font clamp(72,57.726+3.66vw,120) padding-bottom .5em, centered, whitespace pre-line ("Unify your\nfinances"), color orange.
- timeline scrub: trigger header, start `top-=10vh top`, end `bottom+=50vh bottom`. title scale 2->0.3 (dur 2, whole tl; mobile starts at 1); opacity->0 at t1.6 dur .1.
- snippets (5 imgs, opacity set 1 at 0): from projected-viewport-edge offset -> center offset, dur 2 power1.inOut. CSS positions: li1 left19% top6.25% tr(-6%,-40%) w clamp(140,122.138+4.58vw,200); li2 right16.75% top3.125% tr(5%,-2%) w clamp(154,134.344+5.04vw,220) z4; li3 bottom20% right13.75% tr(4%,-10%) w clamp(168,146.55+5.5vw,240) z2; li4 bottom8.25% left31.25% w clamp(154..220) z5; li5 left1.75% top37.25% tr(-6%,-10%) w(154..220) z3. (breakpoint variants in css dump)
- taglines ul title-2, li: height 100vh; margin-top calc(1.1em - 80vh); padding-top 50vh; sticky top0; transform translateY(calc((index - items*.5)*1.1em)); first li margin-top 0; last li (empty) height 20vh. each div from {opacity .8, yPercent 100} scrub start 'top center' end 'bottom bottom' of li. icon-card 80-40 square br-24-12, colors #34C771 plus / #477EE9 send / #FB2D54 exchange; h3 color var(--color); gap-20.

## Walkthrough (_jeton-walkthrough) — TIME-based autoplay, not scrubbed
- section 100lvh orange, white text; scroll-snap directive (snaps if within ±20vh for 2.5s idle); plays when in view (IO), pauses when out.
- .rives: --sh 60vh square, centered grid (5 Rive phone animations stacked; only current visible; each canvas 151.515% of box). <1024: 59vh top -6vh; <744: top -7vh.
- articles absolute inset 0 opacity 0 (fragments set opacity 1 at start). stepper bottom-left padding 32 (align flex-end); <1024 top-center. restart button bottom calc(7% + 32px) centered, fades in +=1 at end (dur 1 power3 from opacity0 y20).
- timeline: step1 rive; heading1 enter a+.1 leave a+1.55; heading2 enter a+2.2 leave a+3.45; feature1 enter a+3.9 leave a+6 | step2 feature enter b+.5 leave b+6 | step3 enter c+0 leave c+2.6 | step4 enter d+.1 leave d+2.6 | step5 subheadings enter e+.6 / e+.9. Step length = rive animation duration.
- heading (title-3 xs-title-5, centered, top 21% (12% <=1440, 20% mobile), p max-width cols-10): enter from {opacity0,y20} .6 power2.out; leave to {opacity0,y-20} .5 power2.in.
- feature (left grid-margin, width cols-5, vertically centered; right variant aligned right): divider (1px line, width 100%+gap, mb 20) scaleX 0->1 .9 power2 (origin left); title subhead-1 xs-subhead-2 mb-8; text body color #FDCBC4 weight 450. p's from opacity0 y20 .6 delay .1 stagger .1. leave: divider scaleX0 y-20 .4 power2.in; p's opacity0 y-20 .4 stagger .05. <1024: bottom aligned padding-bottom 13vh full width, no divider.
- subheading (step5): title-5, left/right columns width cols-4, centered vertically; center variant for <1024.
- stepper: body-small flex gap-16 white; each button: index circle 24px (svg two circles r12; second stroke-dasharray progress --p), label width 0 -> --w when active (transition .5s cubic-bezier(.215,.61,.355,1)), label text translateX 33%->0 .4s; inactive opacity .5; click seeks.
- content: "All currencies" / "One App" / feature "Move your money across Europe"... steps Account, Add, Method, Review, Done.

## Mobile app hero (MediaHero) 1249px
- bg image full (lifestyle photo) over #6B3843; g-row color white; col xxl-7 md-9: title-3 -medium, subhead-2 -medium, ctas (primary neutral) gap-32-24; bottom g-row-full flex gap-24 app buttons outline. No animation.

## Card overview (my-180-64)
- centered col xxl-8: Tag (orange, motion: outline pill stroke draws --p 0->1 1s power3.inOut, svg scale1.4->1 opacity0->1) + h2 title-5 -medium mt-16 ("Contactless payments? Sure.\nSpending limits? Check.\nCard freezing? Also check.")
- media (video) col xxl-10 my-96-48 br-20-8: from {yPercent10, scale.9, rotate-2} scrub start 'top bottom' end 'center center' (dur .55).
- secondary: col xxl-10 gap-32-24 -medium: h3 title-3, p subhead-2 w-cols-6, CTA primary orange.

## Currency exchange calculator
- Matter.js physics: currency coin icons (flag circles) fall into canvas when section top hits top (once); obstacles = converter card; mouse drag; bump on scroll velocity near center; runs only when visible.
- content: Tag "Exchange" + h2 title-3 xs-title-4 -medium mt-16 whitespace pre-line + disclaimer caption; converter card w-cols-4.

## Testimonials
- bg orange (+ bg image parallax -.066); h2 title-3 xs-title-4 -medium color orange-25 mt-80 mb-120-64; ul.cards w-cols-4 (lg 6, sm 8, xs 15) centered, body -book white; cards (li > .card): p title, p text opacity .7, avatar row (initials circle colors #BCFFBB #BBD2FF #F5FFBB #FFBBF0, text #360802).
- stacking: cards 2..n from {y: -(card.top - gap), scale 1-.07*(i+1)} scrub (start top+=margin+height-offset bottom, end bottom+=margin-bottom-offset-gap bottom); margin=120/1700*vw, gap=6/1700*vw; taller cards clip-path inset top.

## Extra bold hero (final CTA) 870px, grid-stack
- base layer: color-orange background-white; clone (aria-hidden) on top: color-white background-orange; py-216-140; h2 title-1 -medium w-cols-12; p subhead-2 -medium w-cols-10 mt-64-24; ctas mt-64-48 gap-24 (app buttons outline).
- clone clip-path polygon(0% -1%,100% -1%,100% o%,50% x%,50% x%,0% o%) with x=100*(1.01-p^.6), o=100*(1-p^3); ScrollTrigger start 'top bottom' end 'top+=1vh top' -> orange curtain retracts upward with a V point revealing white/orange-text.

## Footer
- g-row-full color-orange -book: links 5 cols (accordion on mobile, header opacity .5 + plus icon), externals (app buttons outline, certifications, socials), divider opacity .1, language select + "Made by", giant wordmark (glyphs from x-20 y.8*h -> 0 stagger .05 power1; progress smoothed .7s power4; trigger top bottom -> center center), legal caption opacity .5 mt-96-32, partnership cards.

## Menu (bottom, fixed): menu-bar bg #F84D35 pill (radius h/2) gap-2 padding 2; items _menu-button height 44 padding 0 16 radius 6em body-small -book white; home = icon only; active bg white opacity .1; hover bg opacity .1 scale .9->1. Groups open drawers upward (slot translateY(110%) rotate(1deg) -> 0, .6s cubic-bezier(.23,1,.32,1)); shade #360802 opacity .166 on hover/open. Mobile: overlay variant (menu-bar height 48, burger morph to X; full overlay slides: bg yPercent 101->0, main 121->0, slot -101->0 .8 expo.out; wordmark chars yPercent101 rotate3 -> 0 .9 power4 stagger .03).
## Buttons: label chars roll: hover chars translateY(-110%) .25s cubic-bezier(.55,.085,.68,.53) delay 7ms*i; clone chars from translateY(110%) rotate(20deg) -> 0 .5s cubic-bezier(.165,.84,.44,1) delay .12s+7ms*i; bg scale .98 hover / .95 active.
## Parallax directive: fromTo y vh(e*100) -> vh(-e*100) scrub over parent visibility.

## More specs
- subhead-1 clamp(23px,19.139+.99vw,36px) ls.01em lh1.2 | subhead-2 clamp(19px,17.518+.38vw,24px) lh1.2 ls.01em | subhead-3 clamp(18,17.415+.15vw,20).
- weights: -book 450, -medium 500, -semibold 600.
- [data-button]: height 48, radius 12, padding 0 24, gap 8, inline-flex; bg layer backdrop blur 20; primary bg = --background-color (hover .85); secondary bg opacity .1 (neutral) / .05 (orange); outline: 1px border (::after). tone neutral: color orange on white bg (primary) / white text (outline, secondary). tone orange: white on orange (primary) / orange text (outline).
- app button 148x44 outline.
- navbar: absolute top, padding var(--32-24) 0; wordmark height var(--32-24); lang+ctas gap clamp(16..24); ctas gap clamp(8..12); <1024 hide last cta.
- mobile-app-hero: gap 160; padding-top clamp(160px,-1603.04px+136.67vw,365px); padding-bottom clamp(160px,-1904px+160vw,400px); bg #6B3843 + video (3D phone in ribbed ring). <744: padding 0; g-row bg #6B3843 pt64 pb48 with gradient fade; media starts top 200; secondary ctas padding-top 500.
- currency section: margin-top calc(var(--180-64)*-1); padding-top 2*var(--180-64); padding-bottom clamp(36px,144.999-6.41vw,120px); z2.
- converter: two fields (currency dropdown chip + amount) bg orange-25, radius 16; swap btn 32 circle.
- wordmark glyph grid.
- mobile menu (<1024): "Menu ☰" pill (h48, max-w 70vw) bottom center; overlay full orange: top ctas (lang + sign up), list rows min-h 64 font subhead-2 medium with 48px thumbs, active row bg white .1 + dot; group labels muted; dividers.
- mobile hero: title top (48px), subtitle+store buttons bottom; login top-right glass.
- mobile walkthrough: stepper top center, phone center, feature text bottom-left (title subhead + desc).
- testimonials: glass cards (dark translucent, blur) stacked over full-bleed photo.
