import {z} from 'zod';

export default z.object({
    MAPBOX_DOWNLOAD_TOKEN: z.string().min(1),
    APP_VARIANT: z.enum(['development', 'test', 'production']),
    FEATURE_TRACKS: z.string().optional(),
});

