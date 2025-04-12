import { Form, InputNumber, DatePicker, Switch, Button, Card, Tag } from "antd";
import { useState } from "react";
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { algorithm } from "./logic";
import { ALLOWED_DIFFERENCE, informationText, initForm, tagColor } from "./utils/constants";
import { ChartEntry, INFO, Input } from "./utils/types";
import { maxDomain } from "./utils/functions";
import MapPicker from "./MapPicker";

const { RangePicker } = DatePicker;

const SmartInstallationForm = () => {
  const [form] = Form.useForm();
  const [isSmart, setIsSmart] = useState(false);
  const [realUsage, setRealUsage] = useState(0);
  const [data, setData] = useState<ChartEntry[]>([]);
  const [sumInfo, setSumInfo] = useState<INFO>('tbd');
  const [location, setLocation] = useState<[number, number] | null>(null);


  const onFinish = async (values: any) => {
    if (isSmart) {
      const sumInf = values.criticalInfrastructurePercentage + values.percentageOfTotal
      if (sumInf > 100) {
        alert("Suma procentów inteligentnej instalacji nie może przekraczać 100%")
        return
      }

    }

    const payload: Input = {
      realPower: values.realPower,
      startDate: values.dateRange ? values.dateRange[0].toISOString() : null,
      endDate: values.dateRange ? values.dateRange[1].toISOString() : null,
      intelligentSettings: isSmart ? {
        percentageOfTotal: values.percentageOfTotal / 100,
        dimmingPowerPercentage: values.dimmingPowerPercentage / 100,
        dimmingTimePercentage: values.dimmingTimePercentage / 100,
        criticalInfrastructurePercentage: values.criticalInfrastructurePercentage / 100,
      } : undefined
    };

    const result = algorithm(payload);
    setData(result);

    // Sum up the usage
    setRealUsage(values.realUsage);
    const sumUsage = result.reduce((acc, item) => acc + item.usage, 0);

    if (sumUsage < values.realUsage * (1 - ALLOWED_DIFFERENCE)) {
      setSumInfo('too_small');
    } else if (sumUsage > values.realUsage * (1 + ALLOWED_DIFFERENCE)) {
      setSumInfo('too_much');
    } else {
      setSumInfo('ok');
    }

  };

  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  }));

  const maxUsage = Math.max(...data.map((item) => item.usage));
  const sumUsage = data.reduce((acc, item) => acc + item.usage, 0);

  return (<>
    <Card title="Kalkulator zużycia" style={{ maxWidth: 900, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initForm}>
        <Form.Item label="Zużycie w danym okresie" name="realUsage" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} addonAfter="kWh" />
        </Form.Item>

        <Form.Item label="Moc instalacji" name="realPower" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} addonAfter="kW" />
        </Form.Item>

        <Form.Item label="Zakres dat" name="dateRange" rules={[{ required: true }]}>
          <RangePicker picker="date" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Lokalizacja instalacji">
          <MapPicker onLocationSelect={(lat, lng) => setLocation([lat, lng])} />
        </Form.Item>
        
        <Form.Item label="Instalacja inteligentna">
          <Switch checked={isSmart} onChange={(value) => setIsSmart(value)} />
        </Form.Item>

        <Form.Item label="Instalacja inteligentna stanowi procent całości" name="percentageOfTotal">
          <InputNumber min={0} max={100} style={{ width: "100%" }} disabled={!isSmart} addonAfter="%" />
        </Form.Item>

        <Form.Item label="Procentowy pobór mocy przy ściemnieniu" name="dimmingPowerPercentage">
          <InputNumber min={0} max={100} style={{ width: "100%" }} disabled={!isSmart} addonAfter="%" />
        </Form.Item>

        <Form.Item label="Procentowy czas ściemnienia" name="dimmingTimePercentage">
          <InputNumber min={0} max={100} style={{ width: "100%" }} disabled={!isSmart} addonAfter="%" />
        </Form.Item>

        <Form.Item label="Infrastruktura krytyczna" name="criticalInfrastructurePercentage">
          <InputNumber min={0} max={100} style={{ width: "100%" }} disabled={!isSmart} addonAfter="%" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Potwierdź</Button>
        </Form.Item>
      </Form>
    </Card>
    {sumInfo !== 'tbd' && <><h1>Wyniki - szacowane zużycie</h1><div style={{ width: "100%", overflowX: "auto" }}>
      <ResponsiveContainer height={600}>
        <BarChart data={formattedData}>
          <XAxis dataKey="formattedDate" />
          <YAxis domain={[0, maxDomain(maxUsage)]} />
          <Tooltip />
          <Bar dataKey="usage" fill="#8884d8">
            <LabelList dataKey="usage" position="top" formatter={(value: string) => `${value} Wh`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer><p>Całkowite szacowane: <b>{sumUsage} kWh</b></p>
      <p>Rzeczywiste: <b>{realUsage} kWh</b></p>
      <Tag color={tagColor[sumInfo]}>{informationText[sumInfo]}</Tag>
    </div></>}
  </>
  );
};

export default SmartInstallationForm;
