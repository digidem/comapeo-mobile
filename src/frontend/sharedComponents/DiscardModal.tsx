import React, {FC, ReactNode, RefObject} from 'react';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetContent, BottomSheetModal} from './BottomSheetModal';
import {ActionButtonConfig} from './BottomSheet/Content.tsx';

export interface DiscardModal {
  bottomSheetRef: RefObject<BottomSheetModalMethods>;
  isOpen: boolean;
  title: string;
  description: string;
  buttonConfigs: ActionButtonConfig[];
  icon?: ReactNode;
  loading?: boolean;
}

export const DiscardModal: FC<DiscardModal> = props => {
  const {bottomSheetRef, isOpen} = props;

  return (
    <BottomSheetModal ref={bottomSheetRef} isOpen={isOpen}>
      <BottomSheetContent {...props} />
    </BottomSheetModal>
  );
};
