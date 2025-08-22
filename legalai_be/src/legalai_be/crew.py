from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List

# Import the enhanced legal tools with Serper integration
from legalai_be.tools.custom_tool import SerperLegalSearchTool, LegalSearchTool

# Import additional CrewAI tools for comprehensive web search
try:
    from crewai_tools import SerperDevTool, WebsiteSearchTool
    CREWAI_TOOLS_AVAILABLE = True
except ImportError:
    CREWAI_TOOLS_AVAILABLE = False
    print("CrewAI tools not available. Using basic legal search tools only.")

# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class LegalaiBe():
    """LegalaiBe crew - Specialized Legal Assistant System"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
    
    # Legal research specialist agent
    @agent
    def legal_researcher(self) -> Agent:
        tools = [SerperLegalSearchTool(), LegalSearchTool()]
        if CREWAI_TOOLS_AVAILABLE:
            tools.extend([SerperDevTool(), WebsiteSearchTool()])
        
        return Agent(
            config=self.agents_config['legal_researcher'], # type: ignore[index]
            tools=tools,
            verbose=True,
            max_execution_time=300,
            step_callback=self._log_agent_step
        )

    # Legal analysis expert agent
    @agent
    def legal_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['legal_analyst'], # type: ignore[index]
            tools=[SerperLegalSearchTool(), LegalSearchTool()],
            verbose=True,
            max_execution_time=300,
            step_callback=self._log_agent_step
        )

    # Legal procedure specialist agent
    @agent
    def procedure_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['procedure_specialist'], # type: ignore[index]
            tools=[LegalSearchTool()],
            verbose=True,
            max_execution_time=300,
            step_callback=self._log_agent_step
        )

    # Legal research task
    @task
    def legal_research_task(self) -> Task:
        return Task(
            config=self.tasks_config['legal_research_task'], # type: ignore[index]
            agent=self.legal_researcher
        )

    # Legal analysis task
    @task
    def legal_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['legal_analysis_task'], # type: ignore[index]
            agent=self.legal_analyst,
            context=[self.legal_research_task]
        )

    # Procedure guidance task
    @task
    def procedure_guidance_task(self) -> Task:
        return Task(
            config=self.tasks_config['procedure_guidance_task'], # type: ignore[index]
            agent=self.procedure_specialist,
            context=[self.legal_research_task, self.legal_analysis_task],
            output_file='legal_guidance_report.md'
        )

    def _log_agent_step(self, step_log):
        """Log agent steps for debugging and monitoring"""
        print(f"Agent Step: {step_log}")

    @crew
    def crew(self) -> Crew:
        """Creates the Legal Assistant AI crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            max_execution_time=900,  # 15 minutes total
            memory=True,  # Enable memory for better context retention
            embedder={
                "provider": "openai",
                "config": {
                    "model": "text-embedding-3-small"
                }
            }
        )
