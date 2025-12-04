function About() {
  return (
    <div class="prose max-w-none">
      <h1>About This Project</h1>
      <div class="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>This project is designed for ~13 people to collaborate!</span>
      </div>

      <h2>Tech Stack</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Frontend</h3>
            <ul>
              <li>SolidJS - Reactive UI framework</li>
              <li>Tailwind CSS v4 - Utility-first CSS</li>
              <li>DaisyUI v5 - Component library</li>
              <li>Vite - Build tool</li>
            </ul>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Backend</h3>
            <ul>
              <li>Express - Web framework</li>
              <li>Sequelize - ORM</li>
              <li>MariaDB - Database</li>
              <li>Bun - Runtime</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Development Tools</h2>
      <ul>
        <li>Turbo - Monorepo build system</li>
        <li>Bun - JavaScript runtime & package manager</li>
        <li>Docker - Containerization</li>
        <li>Prettier - Code formatting</li>
      </ul>
    </div>
  );
}

export default About;
