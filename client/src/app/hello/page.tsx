'use client';
import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import styled from 'styled-components';
import axios from 'axios';
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
  const initialUsers: User[] = [{ id: '', name: '' }];
  const [users, setUsers] = useState(initialUsers);
  return (
    <main className={styles.main}>
      <UserBox>
        {users.map((us, i) => (
          <FlexDiv key={i}>
            <IdDiv>{us.id}</IdDiv>
            <NameDiv>
              <Text>{us.name} </Text>
            </NameDiv>
          </FlexDiv>
        ))}
      </UserBox>
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
  width: 200px;
`;
