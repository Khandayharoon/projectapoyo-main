import { format } from "date-fns"

export const dateFormat = (isoDate) => {
	return format(new Date(isoDate), "MMM dd, yyyy hh:mm a")
}

export const dateFormat2 = (isoDate) => {
	return format(new Date(isoDate), "MMM dd, yyyy")
}


export const convertToIsoDate = (timestamp) => {
	const date = new Date(timestamp * 1000);
	return date.toISOString();
};