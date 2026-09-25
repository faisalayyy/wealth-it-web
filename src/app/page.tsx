import { HomeExperience } from '@/components/HomeExperience';

/**
 * The home route.
 *
 * A thin server component over a client experience — which still renders to real HTML on the
 * server, so the headline, every chapter, the figures and the footer exist in the document a
 * crawler receives. The canvas and the choreography are enhancements on top of a page that is
 * complete without either.
 */
export default function Page() {
  return <HomeExperience />;
}
