from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List

# Import the simple legal tools with Serper integration
from legalai_be.tools.simple_legal_tool import SimpleLegalSearchTool, LegalDocumentTool

# Import additional CrewAI tools for comprehensive web search
try:
    from crewai_tools import SerperDevTool
    SERPER_TOOL_AVAILABLE = True
except ImportError:
    SERPER_TOOL_AVAILABLE = False
    print("SerperDevTool not available. Using basic legal search tools only.")

# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class LegalaiBe():
    """Simple Legal AI Assistant - Easy to read legal information"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # Legal research specialist agent with simple tools
    @agent
    def legal_researcher(self) -> Agent:
        tools = [SimpleLegalSearchTool()]
        if SERPER_TOOL_AVAILABLE:
            tools.append(SerperDevTool())
        
        return Agent(
            config=self.agents_config['legal_researcher'], # type: ignore[index]
            tools=tools,
            verbose=True,
            max_execution_time=180,  # 3 minutes max
        )

    # Legal analysis expert agent  
    @agent
    def legal_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['legal_analyst'], # type: ignore[index]
            tools=[SimpleLegalSearchTool()],
            verbose=True,
            max_execution_time=120,  # 2 minutes max
        )

    # Legal procedure specialist agent
    @agent
    def procedure_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['procedure_specialist'], # type: ignore[index]
            tools=[LegalDocumentTool(), SimpleLegalSearchTool()],
            verbose=True,
            max_execution_time=120,  # 2 minutes max
        )

    # Legal research task
    @task
    def legal_research_task(self) -> Task:
        return Task(
            config=self.tasks_config['legal_research_task'], # type: ignore[index]
        )

    # Legal analysis task
    @task
    def legal_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['legal_analysis_task'], # type: ignore[index]
            context=[self.legal_research_task]
        )

    # Procedure guidance task
    @task
    def procedure_guidance_task(self) -> Task:
        return Task(
            config=self.tasks_config['procedure_guidance_task'], # type: ignore[index]
            context=[self.legal_research_task, self.legal_analysis_task],
            output_file='simple_legal_guide.md'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Simple Legal AI Assistant crew"""
        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            max_execution_time=600,  # 10 minutes total max
            memory=True,  # Enable memory for better context
        )
