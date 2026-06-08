// @ts-nocheck
/* eslint-disable no-undef */
const {RuleTester} = require('eslint');
const {rules} = require('./intl.js');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run(
  'no-unused-message-descriptors',
  rules['no-unused-message-descriptors'],
  {
    valid: [
      // All keys used via dot notation
      {
        code: `
          import {defineMessages} from 'react-intl';
          const m = defineMessages({
            hello: { id: 'test.hello', defaultMessage: 'Hello' },
            bye: { id: 'test.bye', defaultMessage: 'Bye' },
          });
          formatMessage(m.hello);
          formatMessage(m.bye);
        `,
      },
      // Key used via string literal bracket notation
      {
        code: `
          import {defineMessages} from 'react-intl';
          const m = defineMessages({
            hello: { id: 'test.hello', defaultMessage: 'Hello' },
          });
          formatMessage(m['hello']);
        `,
      },
      // Dynamic bracket access — all keys get a free pass
      {
        code: `
          import {defineMessages} from 'react-intl';
          const m = defineMessages({
            utm: { id: 'test.utm', defaultMessage: 'UTM' },
            dms: { id: 'test.dms', defaultMessage: 'DMS' },
          });
          formatMessage(m[coordinateFormat]);
        `,
      },
      // Exported m — usages live in other files, skip check
      {
        code: `
          import {defineMessages} from 'react-intl';
          export const m = defineMessages({
            hello: { id: 'test.hello', defaultMessage: 'Hello' },
            unused: { id: 'test.unused', defaultMessage: 'Not used here' },
          });
        `,
      },
      // No defineMessages at all — nothing to check
      {
        code: `const x = 1;`,
      },
    ],

    invalid: [
      // One key defined but never referenced
      {
        code: `
          import {defineMessages} from 'react-intl';
          const m = defineMessages({
            used: { id: 'test.used', defaultMessage: 'Used' },
            unused: { id: 'test.unused', defaultMessage: 'Unused' },
          });
          formatMessage(m.used);
        `,
        errors: [{messageId: 'unused', data: {key: 'unused'}}],
      },
      // All keys defined but none referenced
      {
        code: `
          import {defineMessages} from 'react-intl';
          const m = defineMessages({
            hello: { id: 'test.hello', defaultMessage: 'Hello' },
          });
        `,
        errors: [{messageId: 'unused', data: {key: 'hello'}}],
      },
    ],
  },
);

ruleTester.run(
  'no-duplicate-message-descriptor-ids',
  rules['no-duplicate-message-descriptor-ids'],
  {
    valid: [
      // All IDs are unique
      {
        code: `
          import {defineMessages} from 'react-intl';
          const m = defineMessages({
            hello: { id: 'test.hello', defaultMessage: 'Hello' },
            bye: { id: 'test.bye', defaultMessage: 'Bye' },
          });
        `,
      },
      // Single descriptor — nothing to duplicate
      {
        code: `
          import {defineMessages} from 'react-intl';
          const m = defineMessages({
            hello: { id: 'test.hello', defaultMessage: 'Hello' },
          });
        `,
      },
    ],

    invalid: [
      // Two descriptors share the same id
      {
        code: `
          import {defineMessages} from 'react-intl';
          const m = defineMessages({
            hello: { id: 'test.hello', defaultMessage: 'Hello' },
            hi: { id: 'test.hello', defaultMessage: 'Hi' },
          });
        `,
        errors: [{messageId: 'duplicate', data: {id: 'test.hello'}}],
      },
    ],
  },
);
