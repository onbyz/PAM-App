import { useState, useEffect } from "react"
import { FaXmark } from "react-icons/fa6"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"
import { useLoading } from "@/hooks/useLoading"

export default function CreateSchedule() {

  const { isLoading, withLoading } = useLoading()

  const [schedules, setSchedules] = useState([])
  const [vessels, setVessels] = useState([])
  const [ports, setPorts] = useState([])
  const [destinations, setDestinations] = useState([{ destination: 'Europe' }])

  const [etdDate, setEtdDate] = useState("")
  const [etaDubai, setEtaDubaiDate] = useState("")
  const [etaDate, setEtaDate] = useState("")
  const [dayDifference, setDayDifference] = useState(0)

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [countries, setCountries] = useState([])

  const [etaUsaCanada, setEtaUsaCanada] = useState("")
  const [transitTimeUsaCanada, setTransitTimeUsaCanada] = useState("")

  const fetchSchedules = async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/`)
      setSchedules(response.data)

      const vesselData = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vessel`)
      const vesselArray = Array.isArray(vesselData.data.data) ? vesselData.data.data : []
      setVessels(vesselArray)

      const portsData = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port`)
      const portsArray = Array.isArray(portsData.data.data) ? portsData.data.data : []
      setPorts(portsArray)

      const destinationData = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/destinations`)
      const destinationsArray = Array.isArray(destinationData.data.data) ? destinationData.data.data : []
      // setDestinations(destinationsArray)

      const countries = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/countries`)
      const data = countries.data?.data || []
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name))
      setCountries(sortedData)
    } catch (error) {
      console.error("Error fetching schedules:", error)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  // Function to calculate day difference
  const calculateDayDifference = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) // Convert ms to days
  }

  // Update day difference when ETD or ETA changes
  // useEffect(() => {
  //   if (etdDate && etaDate) {
  //     setDayDifference(calculateDayDifference(etdDate, etaDate));
  //   }
  // }, [etdDate, etaDate]);

  const getPreviousDay = (date) => {
    if (!date) return ""
    const prevDay = new Date(date)
    prevDay.setDate(prevDay.getDate() - 1)
    return prevDay.toISOString().split("T")[0]
  }

  const formSchema = z.object({
    country: z.string().nonempty("Country is required"),
    port_id: z.string().nonempty("Port is required"),
    etd: z.string().nonempty("ETD is required"),
    vessel_id: z.string().nonempty("Vessel is required"),
    voyage_no: z
      .string()
      .nonempty("Voyage No is required")
      .regex(/^[a-zA-Z0-9]+$/, "Voyage No must be alphanumeric (e.g., '037W')"),
    cfs_closing: z.string().nonempty("CFS Closing is required"),
    fcl_closing: z.string().nonempty("FCL Closing is required"),
    eta_transit: z.string().nonempty("ETA Transit is required"),
    destination: z.string().nonempty("Destination is required"),
    dst_eta: z.string().nonempty("Destination ETA is required"),
    transit_time: z.string().nonempty("Transit Time is required"),
    eta_usa: z.string().nonempty("ETA USA/Canada is required"),
    transit_time_usa: z.string().nonempty("Transit Time USA/Canada is required"),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      country: "",
      port_id: "",
      etd: "",
      vessel_id: "",
      voyage_no: "",
      cfs_closing: "",
      fcl_closing: "",
      eta_transit: "",
      destination: "",
      dst_eta: "",
      transit_time: calculateDayDifference(etdDate, etaDate) || "",
      eta_usa: "",
      transit_time_usa: "",
    },
  })

  const selectedCountryID = countries.find((country) => country.uuid === form.watch("country"))
  const filteredPorts = ports.filter((port) => port.country_id === selectedCountryID?.id)

  const onSubmit = withLoading(async (data) => {
    console.log("Submitting Data:", data)
    try {
      const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule`, data)
      console.log("Form data : ", response.data)
      window.scrollTo({ top: 0, behavior: "smooth" })
      setSuccessMessage("Schedule created successfully")
      setTimeout(() => setSuccessMessage(""), 8000)
      // form.reset()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.data)
        window.scrollTo({ top: 0, behavior: "smooth" })
        setTimeout(() => setErrorMessage(""), 8000)
      } else {
        alert("Error occurred while creating the schedule.")
      }
      console.error("Error Creating Schedule : ", error)
    }
  })

  const getNextDay = (date) => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay.toISOString().split("T")[0]
  }

  const { setValue } = form

  const calculateEtaUsaCanada = (etaDate) => {
    if (!etaDate) return ""
    const date = new Date(etaDate)
    date.setDate(date.getDate() + 2)
    return date.toISOString().split("T")[0]
  }

  useEffect(() => {
    if (etaDate) {
      const usaCanadaEta = calculateEtaUsaCanada(etaDate)
      setEtaUsaCanada(usaCanadaEta)
      setValue("eta_usa", usaCanadaEta)
    }
  }, [etaDate, setValue])

  useEffect(() => {
    const transitTime = form.watch("transit_time")
    if (transitTime) {
      const numericValue = Number.parseInt(transitTime, 10)
      if (!isNaN(numericValue)) {
        const usaCanadaTransitTime = (numericValue + 2).toString()
        setTransitTimeUsaCanada(usaCanadaTransitTime)
        setValue("transit_time_usa", usaCanadaTransitTime)
      }
    }
  }, [form.watch("transit_time"), setValue])

  useEffect(() => {
    if (etdDate && etaDate) {
      const difference = calculateDayDifference(etdDate, etaDate)
      const formattedDifference = `${difference}`
      setValue("transit_time", formattedDifference)
    }
  }, [etdDate, etaDate, setValue])

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleFieldBlur = (fieldName) => {
    form.trigger(fieldName);
  };

  return (
    <div>
      <div>
        <div className="md:mr-[2.5%]">
          <div className="mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2">
            <h4 className="leading-[56px] text-[26px] font-medium">Create Schedule</h4>

            <button
              onClick={handleGoBack}
              className="w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 "
            >
              <FaXmark className="mt-[2px]" />
              Close
            </button>
          </div>

          {successMessage && (
            <div className="w-full bg-green-100 text-green-800 text-start p-3 rounded-md my-6 flex justify-between">
              {successMessage}
              <FaXmark className="mt-[2px] hover:cursor-pointer" onClick={() => setSuccessMessage("")} />
            </div>
          )}

          {errorMessage && (
            <div className="w-full bg-red-100 text-red-600 text-start p-3 rounded-md my-6 flex justify-between">
              {errorMessage}
              <FaXmark className="mt-[2px] hover:cursor-pointer" onClick={() => setErrorMessage("")} />
            </div>
          )}

          <div className="mt-4">
            <h6 className="text-[#16A34A] border-b-[1px] border-[#0000001A] pb-4">Origin Port</h6>
          </div>

          <div>
            <Form {...form}>
              <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex flex-col">
                    <FormField
                      name="country"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            Choose Country <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger onBlur={() => handleFieldBlur("country")} className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.id} value={country.uuid} className="text-[16px]">
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <FormField
                      name="port_id"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            Choose Name of Origin Port <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger onBlur={() => handleFieldBlur("port_id")} className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredPorts.map((item) => (
                                  <SelectItem key={item.uuid} value={item.uuid} className="text-[16px]">
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="etd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            Enter ETD <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              onBlur={() => handleFieldBlur("etd")}
                              className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                              min={new Date().toISOString().split("T")[0]}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                setEtdDate(e.target.value)
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="my-8">
                  <h6 className="text-[#16A34A] border-b-[1px] border-[#0000001A] pb-4">Vessel, Voyage, CFS & FCL</h6>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col">
                    <FormField
                      name="vessel_id"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            Choose Vessel <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger onBlur={() => handleFieldBlur("vessel_id")} className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {vessels.map((item) => (
                                  <SelectItem key={item.uuid} value={item.uuid} className="text-[16px]">
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="voyage_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            Voyage No <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              onBlur={() => handleFieldBlur("voyage_no")}
                              className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 my-8">
                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="cfs_closing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            CFS Closing <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              onBlur={() => handleFieldBlur("cfs_closing")}
                              className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                              min={new Date().toISOString().split("T")[0]}
                              max={etdDate ? getPreviousDay(etdDate) : ""}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="fcl_closing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            FCL Closing <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              onBlur={() => handleFieldBlur("fcl_closing")}
                              className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                              min={new Date().toISOString().split("T")[0]}
                              max={etdDate ? getPreviousDay(etdDate) : ""}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="my-8">
                  <h6 className="text-[#16A34A] border-b-[1px] border-[#0000001A] pb-4">Transit Hub</h6>
                </div>

                <div className="flex flex-col">
                  <FormField
                    control={form.control}
                    name="eta_transit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] text-black">
                          Enter ETA Dubai <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            onBlur={() => handleFieldBlur("eta_transit")}
                            className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                            min={etdDate ? getNextDay(etdDate) : new Date().toISOString().split("T")[0]}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setEtaDubaiDate(e.target.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-[14px]" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="my-8">
                  <h6 className="text-[#16A34A] border-b-[1px] border-[#0000001A] pb-4">Destination</h6>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex flex-col">
                    <FormField
                      name="destination"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            Choose Destination <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger onBlur={() => handleFieldBlur("destination")} className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {destinations.map((item) => (
                                  <SelectItem key={item.destination} value={item.destination} className="text-[16px]">
                                    {item.destination}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="dst_eta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            Enter ETA <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              onBlur={() => handleFieldBlur("dst_eta")}
                              className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                              min={etaDubai ? getNextDay(etaDubai) : new Date().toISOString().split("T")[0]}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                setEtaDate(e.target.value)
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="transit_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            Transit Time <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                              onBlur={() => handleFieldBlur("transit_time")}
                              value={field.value ? `${field.value} Days` : ""}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/\D/g, "")
                                field.onChange(numericValue)
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="my-8">
                  <h6 className="text-[#16A34A] border-b-[1px] border-[#0000001A] pb-4">Additional data</h6>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="eta_usa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            ETA USA/Canada <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              onBlur={() => handleFieldBlur("eta_usa")}
                              className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                              min={etaDubai ? calculateEtaUsaCanada(etaDubai) : new Date().toISOString().split("T")[0]}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="transit_time_usa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] text-black">
                            Transit Time USA/Canada <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                              onBlur={() => handleFieldBlur("transit_time_usa")}
                              value={field.value ? `${field.value} Days` : ""}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/\D/g, "")
                                field.onChange(numericValue)
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[14px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-6 mt-8">
                  <button
                    type="submit"
                    className="w-[80px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 disabled:cursor-not-allowed"
                    disabled={isLoading()}

                  >{isLoading() ? (
                    <>
                      <Spinner size="sm" />
                    </>
                  ) : (
                    "Save"
                  )}

                  </button>

                  <button
                    onClick={handleGoBack}
                    type="button"
                    className="w-[80px] h-[40px] text-[14px] flex justify-center items-center border border-[#E2E8F0] rounded-md focus:outline-none appearance-none bg-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
