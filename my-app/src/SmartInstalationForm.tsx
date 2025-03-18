import { Form, InputNumber, DatePicker, Switch, Button, Card } from "antd";
import axios from "axios";
import { useState } from "react";

const { RangePicker } = DatePicker;

const SmartInstallationForm = () => {
  const [form] = Form.useForm();
  const [isSmart, setIsSmart] = useState(false);

  const onFinish = async (values: any) => {

    if(isSmart) {
        const sumInf = values.criticalInfrastructurePercentage + values.percentageOfTotal
        if( sumInf > 100) {
            alert("Suma procentów inteligentnej instalacji nie może przekraczać 100%")
            return
        }
       
    }


    const payload = {
      realUsage: values.realUsage,
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

  return (
    <Card title="Kalkulator zużycia" style={{ maxWidth: 600, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initForm}>
        <Form.Item label="Zużycie w danym okresie" name="realUsage" rules={[{ required: true }]}> 
          <InputNumber min={0} style={{ width: "100%" }} addonAfter="Wh" />
        </Form.Item>

        <Form.Item label="Moc instalacji" name="realPower" rules={[{ required: true }]}> 
          <InputNumber min={0} style={{ width: "100%" }} addonAfter="W" />
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

        <code>
            {JSON.stringify(form.getFieldsValue(), null, 2)}
        </code>

    </Card>
  );
};

export default SmartInstallationForm;
