package expo.modules.actioncreatedocument

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class Options(
    @Field val mimeType: String?,
    @Field val filename: String?,
) : Record