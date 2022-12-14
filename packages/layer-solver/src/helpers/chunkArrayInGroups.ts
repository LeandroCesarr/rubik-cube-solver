export function chunkArrayInGroups<TArray>(arr: TArray[], size: number): Array<TArray[]> {
  var myArray = [];

  for(var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }

  return myArray as Array<TArray[]>;
}