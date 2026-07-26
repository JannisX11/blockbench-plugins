const seed = 0xcafecafe;
export function hash(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) | 0;
	}
	return hash ^ seed;
}

const letters = "abcdefghijklmnopqrstuvwxyz";
export function variable(str: string): string {
	const hashed = hash(str);
	let result = "";
	let num = Math.abs(hashed);
	do {
		result = letters[num % letters.length] + result;
		num = Math.floor(num / letters.length);
	} while (num > 0);
	return "v.__e" + result;
}
