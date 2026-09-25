'use client';

/**
 * Everything that persists between routes: the scroll layer, the transition overlay, the
 * cursor, the running head and the room behind the menu button. The page slots into the middle.
 */

import { useState, type ReactNode } from 'react';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { Transition } from '@/components/providers/Transition';
import { Cursor } from './Cursor';
import { Nav } from './Nav';
import { Menu } from './Menu';
import { Velocity } from './Velocity';

export function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SmoothScroll>
      <Transition>
        <Velocity />
        <div className="ruled-ground" aria-hidden="true" />
        <Nav onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
        <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main id="main">{children}</main>
        <Cursor />
      </Transition>
    </SmoothScroll>
  );
}
