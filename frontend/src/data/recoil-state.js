import { atom, selector } from "recoil";

export const defaultUserState = {
	isAuthenticated: false,
	profile: {}
}
// user state
export const userProfileAuthState = atom({
	key: 'currentUserProfile',
	default: defaultUserState
});


export const userProfileState = selector({
	key: 'currentUserState',
	get: ({ get }) => get(userProfileAuthState).profile
});

export const userProfileAuth = selector({
	key: 'currentUserAuthState',
	get: ({ get }) => get(userProfileAuthState).isAuthenticated
});


// loading state
export const fetchingUserState = atom({
	key: "fetchingUserProfileState",
	default: true
})