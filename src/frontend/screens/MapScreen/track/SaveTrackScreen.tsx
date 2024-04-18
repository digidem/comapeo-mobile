import React, {useRef} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {SaveTrackHeader} from './saveTrack/SaveTrackHeader';
import {DiscardTrackModal} from './saveTrack/DiscardTrackModal';
import {DescriptionField} from '../../ObservationEdit/DescriptionField';
import {useFieldsQuery} from '../../../hooks/server/fields';
import {Field} from '@mapeo/schema';
import {FieldDetails} from '../../Observation/FieldDetails';

export const SaveTrackScreen = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const fieldsQuery = useFieldsQuery();

  const defaultAcc: Field[] = [];
  // const fields = !fieldsQuery.data
  //   ? undefined
  //   : preset.fieldIds.reduce((acc, pres) => {
  //       const fieldToAdd = fieldsQuery.data.find(
  //         field => field.tagKey === pres,
  //       );
  //       if (!fieldToAdd) return acc;
  //       return [...acc, fieldToAdd];
  //     }, defaultAcc);

  return (
    <SafeAreaView>
      <ScrollView>
        <SaveTrackHeader bottomSheetRef={bottomSheetRef} />
        <DescriptionField />
        <DiscardTrackModal bottomSheetRef={bottomSheetRef} />
        {/* <BottomSheet items={bottomSheetItems} /> */}

        {/* {fields && fields.length > 0 && <FieldDetails fields={fields} />} */}
      </ScrollView>
    </SafeAreaView>
  );
};
