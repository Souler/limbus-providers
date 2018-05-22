/**
 * Chunks the given array into a collection of arrays of the specified size
 * @param arr Array to be chunkifed
 * @param size Elements per chunk
 */
export default function chunk<T = any>(arr: T[], size: number): T[][] {
  return arr.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!resultArray[chunkIndex]) { // start a new chunk
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
}
