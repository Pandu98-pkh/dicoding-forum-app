/**
 * Stories untuk komponen LoadingSpinner.
 *
 * Story ini menampilkan animasi loading spinner yang digunakan
 * saat aplikasi sedang memuat data.
 */

import LoadingSpinner from '../components/common/LoadingSpinner';

export default {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export const Default = {};

export const InContainer = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
};
