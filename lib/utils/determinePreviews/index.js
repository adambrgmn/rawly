export default function determinePreviews(previews, predicate) {
  let previewsToExtract;
  let idx;

  switch (predicate) {
    case 's':
    case 'sm':
    case 'small':
    case 'smallest':
      idx = 0;
      break;

    case 'm':
    case 'md':
    case 'medium':
      idx = Math.ceil(previews.length / 2) - 1;
      break;

    case 'l':
    case 'lg':
    case 'large':
    case 'largest':
      idx = previews.length - 1;
      break;

    default:
      idx = undefined;
      break;
  }

  if (typeof idx !== 'undefined') previewsToExtract = previews[idx].id;
  return previewsToExtract;
}
