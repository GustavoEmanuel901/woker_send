import styled from 'styled-components';

export const FileInfo = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Preview = styled.span`
  width: 42px;
  height: 46px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #fff0f0;
  color: #c34848;
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 22px 12px;
  border: 1px dashed #e1e5ee;
  border-radius: 12px;
  color: #7b8496;
  font-size: 14px;
  text-align: center;
`;

export const List = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Entry = styled.li`
  min-width: 0;
  padding: 14px;
  border: 1px solid #e9ecf2;
  border-radius: 13px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const FileCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    overflow: hidden;
    color: #26324b;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: #7b8496;
    font-size: 12px;
  }
`;

export const FileActions = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const Status = styled.span`
  color: #7b8496;
  font-size: 12px;
`;

export const ErrorStatus = styled(Status)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #b83232;
`;

export const FileLink = styled.a`
  display: grid;
  place-items: center;
  color: #68758d;
  text-decoration: none;
`;

export const ExtractButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: 9px;
  background: #5a49db;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 150ms ease;

  &:hover:not(:disabled) {
    background: #4938c5;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

export const SuccessIcon = styled.span`
  color: #21855b;
`;

export const InlineError = styled.p`
  margin: 12px 0 0;
  color: #b83232;
  font-size: 13px;
`;

export const ExtractedData = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 20px;
  margin: 16px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid #edf0f5;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ExtractedField = styled.div`
  min-width: 0;

  dt {
    margin-bottom: 4px;
    color: #8992a3;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  dd {
    overflow-wrap: anywhere;
    margin: 0;
    color: #26324b;
    font-size: 13px;
    line-height: 1.5;
  }

  &:last-child:nth-child(odd) {
    grid-column: 1 / -1;

    @media (max-width: 600px) {
      grid-column: auto;
    }
  }
`;
