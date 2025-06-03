// ES模块中获取__dirname的替代方案
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);
