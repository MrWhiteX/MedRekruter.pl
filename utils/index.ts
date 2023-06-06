export const jsonFetcher = (url: string) =>
  fetch(url).then((res) => {
    return res.json();
  });

interface FileProps {
  api_key: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: [];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
}

export const uploadImage = async (file: File): Promise<FileProps> => {
  let response = await fetch('/api/upload');
  let data = await response.json();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', data.api_key);
  formData.append('timestamp', data.timestamp);
  formData.append('signature', data.sig);

  response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  data = response.json();

  return data;
};
