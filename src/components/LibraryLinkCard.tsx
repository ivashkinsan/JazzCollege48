import React from 'react';
import styles from './LibraryLinkCard.module.css';

interface LibraryLink {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
}

interface LibraryLinkCardProps {
  link: LibraryLink;
}

const LibraryLinkCard: React.FC<LibraryLinkCardProps> = ({ link }) => {
  return (
    <a
      key={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkCard}
    >
      <h3 className={styles.linkTitle}>{link.title}</h3>
      <p className={styles.linkDescription}>{link.description}</p>
      <span className={styles.linkUrl}>{new URL(link.url).hostname}</span>
    </a>
  );
};

export default LibraryLinkCard;
