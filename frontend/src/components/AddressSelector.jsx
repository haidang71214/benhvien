import { useEffect, useState } from "react";
import axios from "axios";

const AddressSelector = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Lỗi load tỉnh:", err));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => setDistricts(res.data.districts))
        .catch((err) => console.error("Lỗi load huyện:", err));
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((res) => setWards(res.data.wards))
        .catch((err) => console.error("Lỗi load xã:", err));
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold mb-4">Chọn địa chỉ</h2>

      <div>
        <label className="block mb-1 font-medium">Tỉnh / Thành phố</label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Chọn tỉnh --</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Quận / Huyện</label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          disabled={!selectedProvince}
        >
          <option value="">-- Chọn huyện --</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Xã / Phường</label>
        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          disabled={!selectedDistrict}
        >
          <option value="">-- Chọn xã --</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddressSelector;
