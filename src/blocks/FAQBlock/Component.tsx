'use client';

import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import type { FAQBlock as FAQBlockType } from '@/payload-types';
import s from './FAQBlock.module.css';

type Props = FAQBlockType & { id?: string };

export default function FAQBlockComponent({
  id,
  heading,
  intro,
  items,
  className,
}: Props) {
  return (
    <section id={id} className={[s.section, className].filter(Boolean).join(' ')}>
      <div className={s.container}>
        <header className={s.header}>
          {heading && <h2 className={s.title}>{heading}</h2>}
          {intro && (
            <div className={s.intro}>
              <PayloadRichText data={intro as SerializedEditorState<SerializedLexicalNode>} />
            </div>
          )}
        </header>

        <div className={s.list}>
          {items?.map((faq, i) => {
            const open = Boolean(faq?.defaultOpen);
            const anchor = faq?.anchor || undefined;

            return (
              <details key={i} className={[s.item, open ? s.open : ''].join(' ')} open={open} id={anchor}>
                <summary className={s.summary}>{faq?.question}</summary>
                {faq?.answer && (
                  <div className={s.answer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
