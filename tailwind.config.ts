import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        crmFormShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.2)',
        addNewReportHeadShadow: '0px 7px 29px 0px rgba(100, 100, 111, 0.2)',
      },
      borderRadius: {
        crmFormRadius: '10px',
      },
      fontSize: {
        formTitleText: [
          '1.8825rem',
          {
            lineHeight: '2.82375rem',
            fontWeight: '500',
          },
        ],
        formTitleSecondaryText: [
          '1.255rem',
          {
            lineHeight: '1.500625rem',
            fontWeight: '500',
          },
        ],
        formLabelText: [
          '1.098125rem',
          {
            lineHeight: '1.6475rem',
            fontWeight: '500',
          },
        ],
        formCheckText: [
          '1.098125rem',
          {
            lineHeight: '1.6475rem',
            fontWeight: '500',
          },
        ],
        formForgotLink: [
          '1rem',
          {
            lineHeight: '1.5rem',
            fontWeight: '600',
          },
        ],
        formSubmitBtnText: [
          '1.098125rem',
          {
            lineHeight: '1.6475rem',
            fontWeight: '600',
          },
        ],
        formAlreadyAccount: [
          '1.255rem',
          {
            lineHeight: '1.50625rem',
            fontWeight: '500',
          },
        ],
        formAlreadyAccountLink: [
          '1.255rem',
          {
            lineHeight: '1.8825rem',
            fontWeight: '600',
          },
        ],
        userInfoName: [
          '1rem',
          {
            lineHeight: '1.5rem',
            fontWeight: '500',
          },
        ],
        userInfoRole: [
          '0.8125rem',
          {
            lineHeight: '1.21875rem',
            fontWeight: '500',
          },
        ],
        dashboardTitle: [
          '2.25rem',
          {
            lineHeight: '3.375rem',
            fontWeight: '600',
          },
        ],
        appointmentsTableHead: [
          '1.25rem',
          {
            lineHeight: '1.21875rem',
            fontWeight: '700',
          },
        ],
        appointmentsTableBody: [
          '1.25rem',
          {
            lineHeight: '1.21875rem',
            fontWeight: '400',
          },
        ],
        appointmentsTableConfirmBtn: [
          '1rem',
          {
            lineHeight: '1.25rem',
            fontWeight: '600',
          },
        ],
        addNewReportTitle: [
          '1.875rem',
          {
            lineHeight: '1.21875rem',
            fontWeight: '600',
          },
        ],
        addNewReportInfo: [
          '1.5rem',
          {
            lineHeight: '1.21875rem',
            fontWeight: '600',
          },
        ],
        addNewReportInfoLabel: [
          '1.098125rem',
          {
            lineHeight: '1.6475rem',
            fontWeight: '500',
          },
        ],
      },
      colors: {
        formColor: '#837B7B',
        formSecondaryColor: '#B3B3B3',
        mainColor: '#00A78B',
        primaryColor: '#00A78B',
        secondaryColor: '#C9EBE6',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
export default config;
