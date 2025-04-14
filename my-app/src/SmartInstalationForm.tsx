import {
  Form,
  InputNumber,
  DatePicker,
  Switch,
  Button,
  Card,
  Tag,
  Select,
  Radio,
} from "antd";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ALLOWED_DIFFERENCE,
  informationText,
  initForm,
  SUN_OPTIONS,
  tagColor,
} from "./utils/constants";
import { ChartEntry, FormValues, INFO, Input } from "./utils/types";
import { maxDomain } from "./utils/functions";
import MapPicker from "./MapPicker";
import { callApiAlgorithm } from "./logic";

const { RangePicker } = DatePicker;

const SmartInstallationForm = () => {
  const [form] = Form.useForm();
  const [isSmart, setIsSmart] = useState(false);
  const [realUsage, setRealUsage] = useState(0);
  const [data, setData] = useState<ChartEntry[]>([]);
  const [sumInfo, setSumInfo] = useState<INFO>("tbd");
  const [location, setLocation] = useState<[number, number] | undefined>(
    undefined
  );
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("monthly");
  const [lastFormData, setLastFormData] = useState<any | null>(null);

  useEffect(() => {
    const updateView = async () => {
      if (!lastFormData) return;

      const values = lastFormData;

      const payload: Input = {
        realPower: values.realPower,
        startDate: values.dateRange?.[0]?.toISOString() ?? "",
        endDate: values.dateRange?.[1]?.toISOString() ?? "",
        intelligentSettings: isSmart
          ? {
              percentageOfTotal: values.percentageOfTotal / 100,
              dimmingPowerPercentage: values.dimmingPowerPercentage / 100,
              dimmingTimePercentage: values.dimmingTimePercentage / 100,
              criticalInfrastructurePercentage:
                values.criticalInfrastructurePercentage / 100,
            }
          : undefined,
        sunType: values.sunType || undefined,
      };

      const result = await callApiAlgorithm(
        payload,
        location,
        viewMode === "monthly"
      );
      setData(result);
    };

    updateView();
  }, [viewMode]);

  const onFinish = async (values: FormValues) => {
    if (isSmart) {
      if (values.criticalInfrastructurePercentage > 100) {
        alert(
          "Suma procentów inteligentnej instalacji nie może przekraczać 100%"
        );
        return;
      }

      if (values.dimmingPowerPercentage > 100) {
        alert("Moc nie moze być większa niż 100% mocy instalacji");
        return;
      }

      if (values.dimmingTimePercentage > 100) {
        alert("Czas nie moze być większa niż 100% czasu");
        return;
      }

      if (values.percentageOfTotal > 100) {
        alert("Procent nie moze być większy niż 100%");
        return;
      }
    }

    const payload: Input = {
      realPower: values.realPower,
      startDate: values.dateRange[0].toISOString(),
      endDate: values.dateRange[1].toISOString(),
      intelligentSettings: isSmart
        ? {
            percentageOfTotal: values.percentageOfTotal / 100,
            dimmingPowerPercentage: values.dimmingPowerPercentage / 100,
            dimmingTimePercentage: values.dimmingTimePercentage / 100,
            criticalInfrastructurePercentage:
              values.criticalInfrastructurePercentage / 100,
          }
        : undefined,
      sunType: values.sunType || undefined,
    };

    const result = await callApiAlgorithm(
      payload,
      location,
      viewMode === "monthly"
    );
    setData(result);

    // Sum up the usage
    setRealUsage(values.realUsage);
    const sumUsage = result.reduce((acc, item) => acc + item.usage, 0);

    if (sumUsage < values.realUsage * (1 - ALLOWED_DIFFERENCE)) {
      setSumInfo("too_small");
    } else if (sumUsage > values.realUsage * (1 + ALLOWED_DIFFERENCE)) {
      setSumInfo("too_much");
    } else {
      setSumInfo("ok");
    }

    setLastFormData(values);
  };

  const formattedData = data.map((item) => ({
    ...item,
    formattedDate:
      viewMode === "monthly"
        ? new Date(item.date).toLocaleDateString("pl-PL", {
            month: "long",
            year: "numeric",
          })
        : new Date(item.date).toLocaleDateString("pl-PL"),
  }));

  const maxUsage = Math.max(...data.map((item) => item.usage));
  const sumUsage = data.reduce((acc, item) => acc + item.usage, 0);

  return (
    <>
      <Card
        title="Kalkulator zużycia"
        style={{ maxWidth: 900, margin: "auto" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={initForm}
        >
          <Form.Item
            label="Zużycie w danym okresie"
            name="realUsage"
            rules={[{ required: true, message: "Zużycie jest wymagane" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} addonAfter="kWh" />
          </Form.Item>

          <Form.Item
            label="Moc instalacji"
            name="realPower"
            rules={[
              { required: true, message: "Moc instalacji jest wymagana" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} addonAfter="kW" />
          </Form.Item>

          <Form.Item
            label="Zakres dat"
            name="dateRange"
            rules={[{ required: true, message: "Zakres dat jest wymagany" }]}
          >
            <RangePicker picker="date" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Typ wschodu słońca" name="sunType">
            <Select options={SUN_OPTIONS} />
          </Form.Item>

          <Form.Item label="Lokalizacja instalacji">
            <MapPicker
              onLocationSelect={(lat, lng) => setLocation([lat, lng])}
            />
          </Form.Item>

          <Form.Item label="Instalacja inteligentna">
            <Switch checked={isSmart} onChange={(value) => setIsSmart(value)} />
          </Form.Item>

          <Form.Item
            label="Instalacja inteligentna stanowi procent całości"
            name="percentageOfTotal"
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              disabled={!isSmart}
              addonAfter="%"
            />
          </Form.Item>

          <Form.Item
            label="Procentowy pobór mocy przy ściemnieniu"
            name="dimmingPowerPercentage"
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              disabled={!isSmart}
              addonAfter="%"
            />
          </Form.Item>

          <Form.Item
            label="Procentowy czas ściemnienia"
            name="dimmingTimePercentage"
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              disabled={!isSmart}
              addonAfter="%"
            />
          </Form.Item>

          <Form.Item
            label="Infrastruktura krytyczna"
            name="criticalInfrastructurePercentage"
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              disabled={!isSmart}
              addonAfter="%"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Potwierdź
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {sumInfo !== "tbd" && (
        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <h2 style={{ fontWeight: "600", marginBottom: "32px" }}>
            Wyniki - szacowane zużycie
          </h2>

          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            style={{ marginBottom: 16 }}
          >
            <Radio.Button value="daily">Dzienny</Radio.Button>
            <Radio.Button value="monthly">Miesięczny</Radio.Button>
          </Radio.Group>

          <div style={{ width: "100%", maxWidth: "1200px", margin: "auto" }}>
            <ResponsiveContainer height={400}>
              <BarChart data={formattedData}>
                <XAxis dataKey="formattedDate" />
                <YAxis domain={[0, maxDomain(maxUsage)]} />
                <Tooltip
                  formatter={(value: number) => [`${value} Wh`, "Zużycie"]}
                  labelFormatter={(label: string) =>
                    viewMode === "daily"
                      ? `Data: ${label}`
                      : `Miesiąc: ${label}`
                  }
                />

                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4C9AFF" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#4C9AFF" stopOpacity={0.3} />
                  </linearGradient>
                </defs>

                <Bar
                  radius={[6, 6, 0, 0]}
                  dataKey="usage"
                  fill="url(#barGradient)"
                >
                  {viewMode === "monthly" && (
                    <LabelList
                      dataKey="usage"
                      position="top"
                      formatter={(value: string) => `${value} Wh`}
                    />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: "24px" }}>
            <p style={{ fontSize: "16px" }}>
              Całkowite szacowane: <b>{sumUsage} kWh</b>
            </p>
            <p style={{ fontSize: "16px" }}>
              Rzeczywiste: <b>{realUsage} kWh</b>
            </p>
            <Tag color={tagColor[sumInfo]}>{informationText[sumInfo]}</Tag>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartInstallationForm;
