import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  isAuthLoginReducer,
  isAuthLogoutReducer,
  isAuthRegisterReducer,
} from "./features/auth/states/reducer";
import {
  isChangeProfilePasswordReducer,
  isChangeProfilePhotoReducer,
  isChangeProfileReducer,
  isProfileReducer,
  profileReducer,
  userReducer,
  usersReducer,
} from "./features/users/states/reducer";
import {
  isPostAddCommentReducer,
  isPostAddReducer,
  isPostAddedCommentReducer,
  isPostAddedReducer,
  isPostChangeCoverReducer,
  isPostChangeReducer,
  isPostChangedCoverReducer,
  isPostChangedReducer,
  isPostDeleteAllReducer,
  isPostDeleteCommentReducer,
  isPostDeleteReducer,
  isPostDeletedAllReducer,
  isPostDeletedCommentReducer,
  isPostDeletedReducer,
  isPostLikeReducer,
  isPostLikedReducer,
  isPostReducer,
  postReducer,
  postsReducer,
} from "./features/posts/states/reducer";

export const rootReducer = combineReducers({
  // auth
  isAuthLogin: isAuthLoginReducer,
  isAuthRegister: isAuthRegisterReducer,
  isAuthLogout: isAuthLogoutReducer,
  // users
  users: usersReducer,
  user: userReducer,
  profile: profileReducer,
  isProfile: isProfileReducer,
  isChangeProfile: isChangeProfileReducer,
  isChangeProfilePhoto: isChangeProfilePhotoReducer,
  isChangeProfilePassword: isChangeProfilePasswordReducer,
  // posts
  posts: postsReducer,
  post: postReducer,
  isPost: isPostReducer,
  isPostAdd: isPostAddReducer,
  isPostAdded: isPostAddedReducer,
  isPostChange: isPostChangeReducer,
  isPostChanged: isPostChangedReducer,
  isPostChangeCover: isPostChangeCoverReducer,
  isPostChangedCover: isPostChangedCoverReducer,
  isPostDelete: isPostDeleteReducer,
  isPostDeleted: isPostDeletedReducer,
  isPostLike: isPostLikeReducer,
  isPostLiked: isPostLikedReducer,
  isPostAddComment: isPostAddCommentReducer,
  isPostAddedComment: isPostAddedCommentReducer,
  isPostDeleteComment: isPostDeleteCommentReducer,
  isPostDeletedComment: isPostDeletedCommentReducer,
  isPostDeleteAll: isPostDeleteAllReducer,
  isPostDeletedAll: isPostDeletedAllReducer,
});

export const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
