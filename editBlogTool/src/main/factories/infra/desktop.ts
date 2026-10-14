import { ElectronContentFileReader, ElectronContentFileWriter, ElectronImagePicker } from "@editor/infra/desktop";
import { DirectiveMarkdownParser, DirectiveMarkdownSerializer } from "@editor/infra/markdown";
import type { ContentFileReader, ContentFileWriter } from "@editor/shared/content-files";
import type { ImagePicker } from "@editor/shared/image-picker";
import type { MarkdownParser, MarkdownSerializer } from "@editor/shared/markdown";

export const makeContentFileWriter = (): ContentFileWriter => new ElectronContentFileWriter();

export const makeImagePicker = (): ImagePicker => new ElectronImagePicker();

export const makeMarkdownSerializer = (): MarkdownSerializer => new DirectiveMarkdownSerializer();

export const makeContentFileReader = (): ContentFileReader => new ElectronContentFileReader();

export const makeMarkdownParser = (): MarkdownParser => new DirectiveMarkdownParser();
