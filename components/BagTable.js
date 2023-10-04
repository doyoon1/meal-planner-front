import styled from "styled-components"

const StyledTable = styled .table`
    width: 100%;
    th{
        text-align: left;
        text-transform: uppercase;
        color: #aaa;
        font-weight: normal;
        user-select: none;
    }
`;

export default function BagTable(props) {
    return <StyledTable {...props} />;
}