'use client';
import styled from 'styled-components';
import ButtonWithTo from '@/components/atoms/ButtonWithTo';
export default function Top() {
  return (
    <Container>
      <H2>Hello</H2>
      <ButtonWithTo to="/hello">hello pageへ</ButtonWithTo>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 6rem;
  min-height: 100vh;
`;
const H2 = styled.h2``;
