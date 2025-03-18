import { Form, InputNumber, DatePicker, Switch, Button, Card, Tag } from "antd";
import axios from "axios";
import { useState } from "react";
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartEntry } from "./types";

const { RangePicker } = DatePicker;

const SmartInstallationForm = () => {
  const [form] = Form.useForm();
  const [isSmart, setIsSmart] = useState(false);
  const [realUsage, setRealUsage] = useState(0);

  const onFinish = async (values: any) => {

    if(isSmart) {
        const sumInf = values.criticalInfrastructurePercentage + values.percentageOfTotal
        if( sumInf > 100) {
            alert("Suma procentów inteligentnej instalacji nie może przekraczać 100%")
            return
        }
       
    }


    const payload = {
      realPower: values.realPower,
      startDate: values.dateRange ? values.dateRange[0].toISOString() : null,
      endDate: values.dateRange ? values.dateRange[1].toISOString() : null,
      intelligentSettings: isSmart ? {
        percentageOfTotal: values.percentageOfTotal/ 100,
        dimmingPowerPercentage: values.dimmingPowerPercentage/ 100,
        dimmingTimePercentage: values.dimmingTimePercentage/ 100,
        criticalInfrastructurePercentage: values.criticalInfrastructurePercentage/ 100,
      } : null
    };

    setRealUsage(values.realUsage);
    console.log("Payload:", payload);

    // try {
    //   const response = await axios.post("/api/submit", payload);
    //   console.log("Response:", response.data);
    //   alert("Data submitted successfully!");
    // } catch (error) {
    //   console.error("Error submitting data:", error);
    //   alert("Submission failed.");
    // }
  };

  const initForm = {
    realUsage: 300,
    realPower: 100,
    intelligent: true,
    percentageOfTotal: 100,
    dimmingPowerPercentage: 50,
    dimmingTimePercentage: 60,
    criticalInfrastructurePercentage: 10
  }

  const data: ChartEntry[] = [{
    date: "2025-03-01T00:00:00.000Z",
    usage: 100
  },{
    date: "2025-04-01T00:00:00.000Z",
    usage: 200
  },{
    date: "2025-05-01T00:00:00.000Z",
    usage: 300
  },{
    date: "2025-06-01T00:00:00.000Z",
    usage: 250
  },{
    date: "2025-07-01T00:00:00.000Z",
    usage: 100
  },{
    date: "2025-08-01T00:00:00.000Z",
    usage: 200
  },{
    date: "2025-09-01T00:00:00.000Z",
    usage: 300
  },{
    date: "2025-10-01T00:00:00.000Z",
    usage: 250
  },{
    date: "2025-11-01T00:00:00.000Z",
    usage: 200
  },{
    date: "2025-12-01T00:00:00.000Z",
    usage: 300
  },{
    date: "2026-01-01T00:00:00.000Z",
    usage: 250
  }]

  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  }));

  const maxUsage = Math.max(...data.map((item) => item.usage));
  const sumUsage = data.reduce((acc, item) => acc + item.usage, 0);

  return (<>
  
  <Card title="Kalkulator zużycia" style={{ maxWidth: 600, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initForm}>
        <Form.Item label="Zużycie w danym okresie" name="realUsage" rules={[{ required: true }]}> 
          <InputNumber min={0} style={{ width: "100%" }} addonAfter="kWh" />
        </Form.Item>

        <Form.Item label="Moc instalacji" name="realPower" rules={[{ required: true }]}> 
          <InputNumber min={0} style={{ width: "100%" }} addonAfter="kW" />
        </Form.Item>

        <Form.Item label="Date Range" name="dateRange" rules={[{ required: true }]}> 
          <RangePicker picker="date" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Instalacja inteligentna">
          <Switch checked={isSmart} onChange={(value)=> setIsSmart(value)} />
        </Form.Item>

        <Form.Item label="Instalacja inteligentna stanowi procent całości" name="percentageOfTotal"> 
          <InputNumber min={0} max={100} style={{ width: "100%" }} disabled={!isSmart} addonAfter="%" />
        </Form.Item>

        <Form.Item label="Procentowy pobór mocy przy ściemnieniu" name="dimmingPowerPercentage"> 
          <InputNumber min={0} max={100} style={{ width: "100%" }} disabled={!isSmart}  addonAfter="%"/>
        </Form.Item>

        <Form.Item label="Procentowy czas ściemnienia" name="dimmingTimePercentage"> 
          <InputNumber min={0} max={100} style={{ width: "100%" }} disabled={!isSmart}  addonAfter="%"/>
        </Form.Item>

        <Form.Item label="Infrastruktura krytyczna" name="criticalInfrastructurePercentage"> 
          <InputNumber min={0} max={100} style={{ width: "100%" }} disabled={!isSmart}  addonAfter="%"/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </Card>
    <h1>Wyniki - szacowane zużycie</h1>
    <div style={{ width: "100%", overflowX: "auto" }}> 
    <ResponsiveContainer height={600}>
      <BarChart height={600} data={formattedData}>
        <XAxis dataKey="formattedDate" />
        <YAxis domain={[0, maxUsage+100]} />
        <Tooltip/>
        <Bar dataKey="usage" fill="#8884d8">
          <LabelList dataKey="usage" position="top" formatter={(value: string) => `${value} Wh`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
      <p>Całkowite szacowane: <b>{sumUsage} kWh</b></p>
      <p>Rzeczywiste: <b>{sumUsage} kWh</b></p>
      <Tag color="#f00">Za duże zużycie</Tag>
      <Tag color="#04d666">OK</Tag>
      <Tag color="#2db7f5">Za małe zużycie</Tag>
  </div>
    
    </>
  );
};

export default SmartInstallationForm;
