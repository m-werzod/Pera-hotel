import { media, type Localized, type MediaImage, type MediaVideo } from "@/config/hotel";

/**
 * A single tile in the media rail. Photographs and clips sit in one ordered
 * list so the rail scrolls through them as one sequence, while each tile still
 * knows how to present itself.
 */
export type RailItem =
  | {
      kind: "image";
      id: string;
      src: string;
      alt: Localized;
      caption?: Localized;
      width: number;
      height: number;
      objectPosition?: string;
      credit?: string;
    }
  | {
      kind: "video";
      id: string;
      src: string;
      poster: string;
      alt: Localized;
      caption?: Localized;
      width: number;
      height: number;
      credit?: string;
    };

function fromImage(item: MediaImage): RailItem {
  return {
    kind: "image",
    id: item.src,
    src: item.src,
    alt: item.alt,
    caption: item.caption,
    width: item.width,
    height: item.height,
    objectPosition: item.objectPosition,
  };
}

function fromVideo(item: MediaVideo): RailItem {
  return {
    kind: "video",
    id: item.src,
    src: item.src,
    poster: item.poster,
    alt: item.alt,
    caption: item.caption,
    width: item.width,
    height: item.height,
    credit: item.credit,
  };
}

/**
 * Build the rail.
 *
 * Clips lead, because motion is what holds attention in a scroller, and the
 * still photography follows. The hero image is skipped: it is already the
 * first thing every visitor sees.
 */
export function getRailItems(): RailItem[] {
  const videos = media.videos.map(fromVideo);
  const images = media.gallery
    .filter((image) => image.src !== media.hero.image.src)
    .map(fromImage);

  return [...videos, ...images];
}

/** Every photograph, for the standalone grid below the rail. */
export function getGalleryImages(): MediaImage[] {
  return [...media.gallery];
}
