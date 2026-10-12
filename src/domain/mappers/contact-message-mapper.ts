import type { ContactMessage } from "../entities";
import type { ContactMessageModel } from "../models";
import type { Mapper } from "./mapper";

export type ContactMessageMapper = Mapper<ContactMessageModel, ContactMessage>;
