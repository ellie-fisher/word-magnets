/**
 * Note: This function mutates the array!
 */
const shuffle = ( array: any[] ): any[] =>
{
	array.forEach (( value, index ) =>
	{
		const randIndex = Math.round (Math.random () * (array.length - 1));
		const temp = array[randIndex];

		array[randIndex] = value;
		array[index] = temp;
	});

	return array;
};


export default shuffle;
