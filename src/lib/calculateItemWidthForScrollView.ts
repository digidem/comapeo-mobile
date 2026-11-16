export function calculateItemWidthForScrollView({
  minItemWidth,
  gap,
  containerSize,
}: {
  minItemWidth: number;
  gap: number;
  containerSize: number;
}) {
  //if the item is bigger than the container, return container size so item can fit
  if (minItemWidth >= containerSize) {
    return containerSize;
  }
  // The total space per thumbnail including gap
  const minSpacePerThumbnail = minItemWidth + gap;

  // Number of full thumbnails that can fit before half thumbnail (minus one gap)
  const maxFullThumbnails = Math.floor(
    containerSize / minSpacePerThumbnail - 0.5,
  );

  // Total number of thumbnails including the half one
  const totalThumbnails = maxFullThumbnails + 0.5;

  // Calculate width of each thumbnail so that (w + gap) * totalThumbnails fits in windowWidth
  return (containerSize - gap * totalThumbnails) / totalThumbnails;
}
