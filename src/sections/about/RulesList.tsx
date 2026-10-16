import { Tag } from '@/components/Tag';
import { col } from '@/lib/grid';
import s from './RulesList.module.css';

/**
 * The reference's CertificationsList: an introduction at the left and a list at the right, one
 * item under another with a line between. Wealthit has no certificates to list, so the list is
 * the rules its books are kept by — the app's own, from its README.
 */
export function RulesList({ tag, title, description, items }: { tag: string; title: string; description: string; items: string[] }) {
  return (
    <section className={s.rules} id="rules" data-ground="light">
      <div className={`g-row ${s.row}`}>
        <div className="gc" style={col({ xxl: 7, xs: 16 }, { xxl: 1, xs: 0 })}>
          <Tag>{tag}</Tag>
          <h2 className={`title-5 xs-subhead-1 -medium ${s.title}`}>{title}</h2>
          <p className={`body -book ${s.description}`}>{description}</p>
        </div>
        <ul className={`gc ${s.list}`} style={col({ xxl: 6, xs: 16 }, { xxl: 1, xs: 0 })}>
          {items.map((it, i) => (
            <li key={it} className={s.item}>
              {i !== 0 && <div className={s.divider} />}
              <h3 className="body -book">{it}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
