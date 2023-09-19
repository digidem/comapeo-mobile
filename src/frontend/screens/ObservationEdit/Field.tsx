import * as React from 'react';

import {useDraftObservation} from '../../hooks/useDraftObservation';
//import {Field as FieldType} from '../../context/ConfigContext';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';

type Props = {
  field: FieldType;
  children: (options: {
    value: any;
    onChange: (fieldValue: any) => void;
  }) => React.ReactElement;
};

const Field = ({field, children}: Props) => {
  const draftValue = usePersistedDraftObservation(store => store.value);
  const {updateDraft} = useDraftObservation();
  const fieldKey: string = Array.isArray(field.key) ? field.key[0] : field.key;
  const tags = {};
  // const value = tags[fieldKey];
  const onChange = (fieldValue: any) =>
    updateDraft({
      tags: {
        ...tags,
        [fieldKey]: fieldValue,
      },
    });
  return children({value, onChange});
};

export default Field;
