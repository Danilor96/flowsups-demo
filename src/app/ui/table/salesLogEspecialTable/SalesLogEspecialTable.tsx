import { useId } from 'react';

export function SalesLogEspecialTable({
  height,
  tableData1,
  tableData2,
  textColor,
  bodyFirstColor,
  bodySecondColor,
  bodyTextColor,
  borderColor,
  fontSize,
  headBackgroundColor,
  headTextCenter,
  headTextColor,
  marginTop,
  width,
}: {
  tableData1: [
    {
      key: number;
      totalFrontend: string;
      perUnitFrontend: string;
    },
    { key: number; totalBackend: string; perUnitBackend: string },
    { key: number; totalTotalGross: string; perUnitTotalGross: string },
  ];
  tableData2: [
    { key: number; chargeback: string },
    { key: number; totalNet: string },
    { key: number; returnedLastMonth: number },
    { key: number; returnedCurrentMonth: number },
    { key: number; monthUnitsSold: number },
    { key: number; totalUnitsSold: number },
  ];
  fontSize?: number;
  textColor: string;
  headTextColor?: string;
  headTextCenter?: boolean;
  headBackgroundColor?: string;
  bodyTextColor?: string;
  bodyFirstColor?: string;
  bodySecondColor?: string;
  marginTop: number;
  width?: number;
  height: number;
  borderColor?: string;
}) {
  const formatName = (name: string) => {
    let formattedName: string = '';

    if (name === 'totalFrontend' || name === 'perUnitFrontend') {
      formattedName = 'Frontend';
    }

    if (name === 'totalBackend' || name === 'perUnitBackend') {
      formattedName = 'Backend';
    }

    if (name === 'totalTotalGross' || name === 'perUnitTotalGross') {
      formattedName = 'Total Gross';
    }

    if (name === 'chargeback') {
      formattedName = 'Chargeback';
    }

    if (name === 'totalNet') {
      formattedName = 'Total Net';
    }

    if (name === 'returnedLastMonth') {
      formattedName = `RTS's from previous months`;
    }

    if (name === 'returnedCurrentMonth') {
      formattedName = 'Returned Current Month';
    }

    if (name === 'monthUnitsSold') {
      formattedName = 'Month Units Sold';
    }

    if (name === 'totalUnitsSold') {
      formattedName = 'Total Units Sold';
    }

    return formattedName;
  };

  return (
    <aside
      className="h-fit rounded-[0.520833vw] overflow-hidden"
      style={{
        width: `${width ? `${width}vw` : '100%'}`,
        marginTop: `${marginTop}vh`,
        borderColor: `${borderColor ? borderColor : '#92CEC3'}`,
      }}
    >
      <table
        className="w-full h-fit font-medium max-lg:text-sm"
        style={{
          fontSize: `${fontSize ? `${fontSize}vh` : '1.8vh'}`,
          color: `${textColor}`,
        }}
      >
        <thead>
          <tr
            className="h-[2.777778vh]"
            style={{
              color: headTextColor,
              textAlign: `${headTextCenter ? 'center' : 'left'}`,
              backgroundColor: `${headBackgroundColor ? headBackgroundColor : '#92CEC3'}`,
            }}
          >
            <th className="w-[50%]">Total</th>
            <th className="w-[50%]">Per Unit</th>
          </tr>
        </thead>
        <tbody
          style={{
            color: bodyTextColor,
          }}
        >
          {tableData1.map((el, index) => (
            <tr
              key={el.key}
              className="h-[2.777778vh] text-center"
              style={{
                backgroundColor:
                  index % 2
                    ? bodyFirstColor
                      ? bodyFirstColor
                      : '#92CEC3'
                    : bodySecondColor
                    ? bodySecondColor
                    : '#00A78B',
              }}
            >
              <td>{`${formatName(Object.keys(tableData1[index])[1])}: ${
                Object.values(tableData1[index])[1]
              }`}</td>
              <td>{`${formatName(Object.keys(tableData1[index])[2])}: ${
                Object.values(tableData1[index])[2]
              }`}</td>
            </tr>
          ))}
        </tbody>
        <tbody
          style={{
            color: bodyTextColor,
          }}
        >
          {tableData2.map((el, index) => (
            <tr
              key={el.key}
              className="h-[2.777778vh] text-center"
              style={{
                backgroundColor:
                  index % 2
                    ? bodySecondColor
                      ? bodySecondColor
                      : '#00A78B'
                    : bodyFirstColor
                    ? bodyFirstColor
                    : '#92CEC3',
              }}
            >
              <td colSpan={2}>{`${formatName(Object.keys(tableData2[index])[1])}: ${
                Object.keys(tableData2[index])[1] !== 'returnedLastMonth'
                  ? Object.keys(tableData2[index])[1] !== 'totalUnitsSold'
                    ? ''
                    : ''
                  : ''
              }${Object.values(tableData2[index])[1]}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}
