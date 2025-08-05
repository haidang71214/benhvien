import { useEffect, useState } from "react";
import axios from "axios";

const AddressSelector = ({
  setValue,
  initialProvince = "",
  initialDistrict = "",
  initialWard = "",
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedWard, setSelectedWard] = useState(initialWard);

  // Khi province, district, ward thay đổi -> gọi setValue từ react-hook-form
useEffect(() => {
  const selected = provinces.find(p => p.code.toString() === selectedProvince);
  setValue("address.province", selected?.name || "");
}, [selectedProvince, provinces]);
useEffect(() => {
  const selected = districts.find(d => d.code.toString() === selectedDistrict);
  setValue("address.district", selected?.name || "");
}, [selectedDistrict, districts]);

useEffect(() => {
  const selected = wards.find(w => w.code.toString() === selectedWard);
  setValue("address.ward", selected?.name || "");
}, [selectedWard, wards]);


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
    <div className="space-y-4">
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
