import * as React from 'react';
import {Text, StyleSheet, StyleProp, ViewStyle, TextInput} from 'react-native';

import {
  CodeField,
  Cursor,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
  RenderCellOptions,
} from 'react-native-confirmation-code-field';
import {MEDIUM_GREY, DARK_GREY, RED, BLACK} from '../lib/styles';

export const CELL_COUNT = 5;
const onlyNumRegEx = new RegExp('^[0-9]+$');

interface PasscodeInputProps {
  stylesProps?: StyleProp<ViewStyle>;
  inputValue: string;
  onChangeTextWithValidation: (newVal: string) => void;
  maskValues?: boolean;
  error: boolean;
}

export const PasscodeInput = React.forwardRef<TextInput, PasscodeInputProps>(
  (
    {
      stylesProps,
      inputValue,
      onChangeTextWithValidation,
      maskValues = true,
      error,
    },
    inputRef,
  ) => {
    const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
      value: inputValue,
      setValue: onChangeTextWithValidation,
    });

    function validateAndSetInput(text: string) {
      if (!text) onChangeTextWithValidation('');
      if (onlyNumRegEx.test(text)) {
        onChangeTextWithValidation(text);
      }
    }

    function renderCell({index, symbol, isFocused}: RenderCellOptions) {
      let textChild;

      if (symbol) {
        textChild = (
          <MaskSymbol
            maskSymbol={maskValues ? '*' : symbol}
            isLastFilledCell={isLastFilledCell({index, value: inputValue})}>
            {symbol}
          </MaskSymbol>
        );
      } else if (isFocused) {
        textChild = <Cursor />;
      }

      return (
        <Text
          key={index}
          style={[
            styles.cell,
            isFocused && styles.focusCell,
            error ? {borderColor: RED} : undefined,
          ]}
          onLayout={getCellOnLayoutHandler(index)}>
          {textChild}
        </Text>
      );
    }

    return (
      <CodeField
        {...codeFieldProps}
        ref={inputRef}
        autoFocus={true}
        value={inputValue}
        onChangeText={validateAndSetInput}
        cellCount={CELL_COUNT}
        rootStyle={[styles.codeFieldRoot, stylesProps]}
        keyboardType="numeric"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
    );
  },
);

const FONT_SIZE = 24;

const styles = StyleSheet.create({
  cell: {
    width: FONT_SIZE * 2,
    height: FONT_SIZE * 2,
    borderRadius: 8,
    fontSize: FONT_SIZE,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: MEDIUM_GREY,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: BLACK,
  },
  focusCell: {
    borderColor: DARK_GREY,
    textAlignVertical: 'top',
  },
  codeFieldRoot: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
