import * as React from 'react';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {MapShareCanceled} from '../../sharedComponents/MapShareCanceled';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';

export function MapShareCanceledBottomSheet({
  navigation,
}: NativeRootNavigationProps<'MapShareCanceledBottomSheet'>) {
  return (
    <BottomSheetWrapper>
      <MapShareCanceled onClose={() => navigation.goBack()} />
    </BottomSheetWrapper>
  );
}
