import axios from "axios";
import { API_BASE_URL, API_AUTH_TOKEN } from "./config";

export const apoyoApi = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	headers: {
		"X-Auth": API_AUTH_TOKEN
	}
})