export const profile = {
  name: "Tanvir",
  role: ".NET & SQL Server Engineer",
  title: "Executive Officer (IT)",
  company: "Astha Life Insurance Company Ltd.",
  city: "Dhaka",
  country: "Bangladesh",
  linkedin: "https://www.linkedin.com/in/tanvir626",
  linkedinLabel: "linkedin.com/in/tanvir626",
  summary:
    "I work on enterprise and insurance systems: long-lived .NET, SQL Server, and the ASP.NET Core APIs in front of them. I am Executive Officer (IT) at Astha Life Insurance Company Ltd. in Dhaka.",
  support:
    "Most days that means keeping legacy .NET maintainable, tuning SQL Server, and building the ERP and insurance applications those systems support.",
  focus: [
    {
      index: "01",
      title: "Legacy .NET",
      body: "Maintenance and modernization of ASP.NET Framework and ASP.NET Core systems that already carry live policies.",
    },
    {
      index: "02",
      title: "SQL Server",
      body: "Schema design and query tuning, where a slow report is a business problem.",
    },
    {
      index: "03",
      title: "ASP.NET Core APIs",
      body: "Web APIs the rest of the business can call, sitting on insurance and enterprise processes.",
    },
    {
      index: "04",
      title: "Business applications",
      body: "ERP and insurance software, where the edge cases are the work.",
    },
  ],
  stack: [
    { label: "Language", items: ["C#", "JavaScript"] },
    {
      label: "Web",
      items: ["ASP.NET Framework", "ASP.NET Core", "MVC", "Web API"],
    },
    { label: "Data", items: ["SQL Server", "Dapper", "Entity Framework"] },
    { label: "Practice", items: ["Git"] },
  ],
  learning: [
    "Software architecture",
    "Testing",
    "Advanced SQL",
    "AI-assisted engineering",
  ],
} as const;
