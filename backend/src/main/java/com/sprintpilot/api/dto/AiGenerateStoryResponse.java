package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Priority;
import java.util.List;

public class AiGenerateStoryResponse {
    private String title;
    private String userStory;
    private String asA;
    private String iWant;
    private String soThat;
    private String businessObjective;
    private List<String> acceptanceCriteria;
    private Priority suggestedPriority;
    private Integer suggestedStoryPoints;
    private List<String> suggestedLabels;
    private List<String> edgeCases;
    private String generationSource; // "Gemini-LLM" or "Heuristic-Engine"

    public AiGenerateStoryResponse() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getUserStory() { return userStory; }
    public void setUserStory(String userStory) { this.userStory = userStory; }
    public String getAsA() { return asA; }
    public void setAsA(String asA) { this.asA = asA; }
    public String getIWant() { return iWant; }
    public void setIWant(String iWant) { this.iWant = iWant; }
    public String getSoThat() { return soThat; }
    public void setSoThat(String soThat) { this.soThat = soThat; }
    public String getBusinessObjective() { return businessObjective; }
    public void setBusinessObjective(String businessObjective) { this.businessObjective = businessObjective; }
    public List<String> getAcceptanceCriteria() { return acceptanceCriteria; }
    public void setAcceptanceCriteria(List<String> acceptanceCriteria) { this.acceptanceCriteria = acceptanceCriteria; }
    public Priority getSuggestedPriority() { return suggestedPriority; }
    public void setSuggestedPriority(Priority suggestedPriority) { this.suggestedPriority = suggestedPriority; }
    public Integer getSuggestedStoryPoints() { return suggestedStoryPoints; }
    public void setSuggestedStoryPoints(Integer suggestedStoryPoints) { this.suggestedStoryPoints = suggestedStoryPoints; }
    public List<String> getSuggestedLabels() { return suggestedLabels; }
    public void setSuggestedLabels(List<String> suggestedLabels) { this.suggestedLabels = suggestedLabels; }
    public List<String> getEdgeCases() { return edgeCases; }
    public void setEdgeCases(List<String> edgeCases) { this.edgeCases = edgeCases; }
    public String getGenerationSource() { return generationSource; }
    public void setGenerationSource(String generationSource) { this.generationSource = generationSource; }
}
