import type { Post } from "../entities";
import type { PostModel } from "../models";
import type { Mapper } from "./mapper";

export type PostMapper = Mapper<PostModel, Post>;
