import { SetMetadata } from '@nestjs/common';

export const publicMetadataKey = 'public';

export const Public = () => SetMetadata(publicMetadataKey, true);
