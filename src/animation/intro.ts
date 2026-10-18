/**
 * Whether an entrance would come too late to play. On a first visit over a slow connection the page
 * has been on screen for a while before the scripts arrive; hiding what is already there to play an
 * intro looks like the page stuck and started again, so intros are skipped then. After a change of
 * page inside the site (PageTransition marks it), the new page is fresh and intros always play.
 */
let navigated = false;

export const markNavigated = () => {
  navigated = true;
};

export const introLate = () => !navigated && typeof performance !== 'undefined' && performance.now() > 1800;
