'use client';
import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import styled from 'styled-components';
import axios from 'axios';
import ButtonWithTo from '@/components/atoms/ButtonWithTo';
import Image from 'next/image';
export default function Home() {
  useEffect(() => {
    const _dataFetch = async () => {
      const res = await axios.get(
        // `https//${process.env.NEXT_PUBLIC_API_URL}` ?? ''
        'https://rust-first.octpsubaru.workers.dev/'
      );
      const users = res.data;
      setUsers(users);
      console.log(res);
    };
    _dataFetch();
  }, []);
  type User = {
    id: string;
    name: string;
  };
  const [formData, setFormData] = useState({
    id: '',
    name: '',
  });
  const [image, setImage] = useState<Blob | string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  const initialUsers: User[] = [{ id: '', name: '' }];
  const [users, setUsers] = useState(initialUsers);
  // Handle form input changes
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData();
    data.append('id', formData.id);
    data.append('name', formData.name);
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await axios.post('/api/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  return (
    <main className={styles.main}>
      <UserBox>
        {users
          .sort((a, b) => Number(a.id) - Number(b.id))
          .map((us, i) => (
            <FlexDiv key={i}>
              <IdDiv>{us.id}</IdDiv>
              <NameDiv>
                <Text>{us.name} </Text>
              </NameDiv>
            </FlexDiv>
          ))}
      </UserBox>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">ID: </label>
          <input
            type="text"
            name="id"
            id="id"
            value={formData.id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        {previewUrl && (
          <div>
            <p>Image Preview:</p>
            <Image
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '200px' }}
            />
          </div>
        )}
        <div>
          <input type="submit" value="登録" />
        </div>
      </form>

      <ButtonWrapper>
        <ButtonWithTo to="/">homeへ戻る</ButtonWithTo>
      </ButtonWrapper>
    </main>
  );
}

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const IdDiv = styled.div`
  text-align: start;
`;

const Text = styled.p`
  font-size: 20px;
  text-align: start;
`;

const NameDiv = styled.div`
  width: 100px;
`;

const UserBox = styled.div`
  width: 100%;
`;

const ButtonWrapper = styled.div`
  margin: 0 auto;
`;
