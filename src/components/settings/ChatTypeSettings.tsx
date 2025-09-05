import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Plus, Trash, Circle } from "lucide-react";
import { useChatTypes, ChatType } from '@/hooks/useChatTypes';
import { Toggle } from "@/components/ui/toggle";

const ChatTypeSettings = () => {
  const {
    chatTypes,
    isLoading: typesLoading
  } = useChatTypes();
  const [isAdding, setIsAdding] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeValue, setNewTypeValue] = useState('');
  const [editingTypes, setEditingTypes] = useState<Record<string, {
    name: string;
    type: string;
  }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  
  const handleAddType = async () => {
    if (!newTypeName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the chat type.",
        variant: "destructive"
      });
      return;
    }

    // Generate a type value from name if not provided
    const typeValue = newTypeValue.trim() || newTypeName.trim().toLowerCase().replace(/\s+/g, '_');
    try {
      setIsSubmitting(true);

      // Get user ID
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id || "00000000-0000-0000-0000-000000000000";
      const {
        error
      } = await supabase.from('chat_types').insert({
        user_id: userId,
        name: newTypeName,
        type: typeValue,
        webhook_url: null,
        is_default: chatTypes.length === 0 // Make default if it's the first one
      });
      if (error) {
        throw error;
      }
      toast({
        title: "Chat Type Added",
        description: `"${newTypeName}" has been added to your chat types.`
      });

      // Reset form
      setNewTypeName('');
      setNewTypeValue('');
      setIsAdding(false);

      // Refresh the page to load the new types
      window.location.reload();
    } catch (error) {
      console.error("Error adding chat type:", error);
      toast({
        title: "Error Adding Chat Type",
        description: "There was a problem adding your chat type. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditChange = (id: string, field: 'name' | 'type', value: string) => {
    setEditingTypes(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {
          name: chatTypes.find(t => t.id === id)?.name || '',
          type: chatTypes.find(t => t.id === id)?.type || '',
        }),
        [field]: value
      }
    }));
  };
  const startEditing = (type: ChatType) => {
    setEditingTypes(prev => ({
      ...prev,
      [type.id]: {
        name: type.name,
        type: type.type || type.name.toLowerCase().replace(/\s+/g, '_'),
      }
    }));
  };
  const saveTypeChanges = async (id: string) => {
    const editData = editingTypes[id];
    if (!editData?.name.trim()) {
      toast({
        title: "Name Required",
        description: "Chat type name cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    // Generate a type value from name if not provided
    const typeValue = editData.type.trim() || editData.name.trim().toLowerCase().replace(/\s+/g, '_');
    try {
      setIsSubmitting(true);
      const {
        error
      } = await supabase.from('chat_types').update({
        name: editData.name,
        type: typeValue,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (error) {
        throw error;
      }
      toast({
        title: "Changes Saved",
        description: "Your chat type has been updated."
      });

      // Remove from editing state
      setEditingTypes(prev => {
        const newState = {
          ...prev
        };
        delete newState[id];
        return newState;
      });

      // Refresh to load updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating chat type:", error);
      toast({
        title: "Error Saving Changes",
        description: "There was a problem updating your chat type. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const deleteType = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }
    try {
      setIsSubmitting(true);
      const {
        error
      } = await supabase.from('chat_types').delete().eq('id', id);
      if (error) {
        throw error;
      }
      toast({
        title: "Chat Type Deleted",
        description: `"${name}" has been removed from your chat types.`
      });

      // Refresh to load updated data
      window.location.reload();
    } catch (error) {
      console.error("Error deleting chat type:", error);
      toast({
        title: "Error Deleting Chat Type",
        description: "There was a problem deleting your chat type. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const setAsDefault = async (id: string, name: string) => {
    try {
      setIsSubmitting(true);
      const {
        error
      } = await supabase.from('chat_types').update({
        is_default: true,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (error) {
        throw error;
      }
      toast({
        title: "Default Updated",
        description: `"${name}" is now your default chat type.`
      });

      // Refresh to load updated data
      window.location.reload();
    } catch (error) {
      console.error("Error setting default chat type:", error);
      toast({
        title: "Error Setting Default",
        description: "There was a problem updating your default chat type. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (typesLoading) {
    return <div className="text-center py-4">Loading chat types...</div>;
  }
  
  return <div className="space-y-6">
      <div className="border-b border-thanos-purple pb-4 mb-4">
        <h3 className="text-lg font-orbitron text-[#33C3F0] mb-2">Chat Types</h3>
        <p className="text-sm text-gray-300">
          Configure different conversation types for your AI system. Each type can target different contexts or purposes.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Chat types let you categorize conversations and determine how the AI responds to different queries.
          For example, you might create types for "Technical Support," "Creative Writing," or "Data Analysis."
        </p>
      </div>

      {/* List of existing chat types */}
      <div className="space-y-4">
        {chatTypes.map(type => {
        const isEditing = editingTypes[type.id] !== undefined;
        return <div key={type.id} className="bg-thanos-cosmic-light rounded-lg border border-thanos-purple p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? <div className="space-y-3">
                      <div>
                        <Label htmlFor={`edit-name-${type.id}`} className="text-[#33C3F0] font-space-grotesk">Display Name</Label>
                        <Input id={`edit-name-${type.id}`} value={editingTypes[type.id]?.name || ''} onChange={e => handleEditChange(type.id, 'name', e.target.value)} className="chat-type-input bg-thanos-cosmic-dark" />
                      </div>
                      <div>
                        <Label htmlFor={`edit-type-${type.id}`} className="text-[#33C3F0] font-space-grotesk">Type Value (sent in request)</Label>
                        <Input id={`edit-type-${type.id}`} value={editingTypes[type.id]?.type || ''} onChange={e => handleEditChange(type.id, 'type', e.target.value)} className="chat-type-input bg-thanos-cosmic-dark" placeholder="e.g., personal_business" />
                        <p className="text-xs text-gray-400 mt-1">This is the value sent to your webhook to identify the context</p>
                      </div>
                      <Button onClick={() => saveTypeChanges(type.id)} disabled={isSubmitting} className="bg-[#33C3F0] text-black hover:bg-[#33C3F0]/80 mr-2">
                        <Check className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </div> : <>
                      <div className="flex items-center">
                        <h4 className="font-semibold text-white">{type.name}</h4>
                        {type.is_default && <span className="ml-2 text-xs bg-[#33C3F0]/20 text-[#33C3F0] px-2 py-0.5 rounded-full">
                            Default
                          </span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Type: <span className="font-mono">{type.type || type.name.toLowerCase().replace(/\s+/g, '_')}</span>
                      </p>
                    </>}
                </div>
                
                {!isEditing && <div className="flex space-x-2">
                    {!type.is_default && <Toggle pressed={false} onPressedChange={() => setAsDefault(type.id, type.name)} className="bg-thanos-cosmic-dark hover:bg-thanos-purple text-gray-300 h-8 w-8 p-0" disabled={isSubmitting} title="Set as default">
                        <Circle className="h-4 w-4" />
                      </Toggle>}
                    <Toggle pressed={false} onPressedChange={() => startEditing(type)} className="bg-thanos-cosmic-dark hover:bg-thanos-purple text-gray-300 h-8 w-8 p-0" disabled={isSubmitting} title="Edit">
                      <Plus className="h-4 w-4 rotate-45" />
                    </Toggle>
                    <Toggle pressed={false} onPressedChange={() => deleteType(type.id, type.name)} className="bg-thanos-cosmic-dark hover:bg-thanos-purple text-gray-300 h-8 w-8 p-0" disabled={isSubmitting || type.is_default && chatTypes.length > 1} title={type.is_default && chatTypes.length > 1 ? "Cannot delete default type" : "Delete"}>
                      <Trash className="h-4 w-4" />
                    </Toggle>
                  </div>}
              </div>
            </div>;
      })}
      </div>

      {/* Add new chat type form */}
      {isAdding ? <div className="bg-thanos-cosmic-light rounded-lg border border-thanos-purple p-4 space-y-3">
          <h4 className="font-semibold text-white">Add New Chat Type</h4>
          <div>
            <Label htmlFor="new-type-name" className="text-[#33C3F0] font-space-grotesk">Display Name</Label>
            <Input id="new-type-name" value={newTypeName} onChange={e => setNewTypeName(e.target.value)} className="chat-type-input" placeholder="e.g., Technical Support" />
          </div>
          <div>
            <Label htmlFor="new-type-value" className="text-[#33C3F0] font-space-grotesk">Type Value (sent in request)</Label>
            <Input id="new-type-value" value={newTypeValue} onChange={e => setNewTypeValue(e.target.value)} className="chat-type-input" placeholder="e.g., technical_support" />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank to auto-generate from name. This is the value sent to your webhook.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleAddType} disabled={isSubmitting} className="bg-[#33C3F0] text-black hover:bg-[#33C3F0]/80">
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button onClick={() => setIsAdding(false)} variant="outline" className="border-thanos-purple" disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </div> : <Button onClick={() => setIsAdding(true)} className="bg-thanos-purple hover:bg-thanos-purple-light text-white" disabled={isSubmitting || chatTypes.length >= 6}>
          <Plus className="h-4 w-4 mr-1" /> 
          Add Chat Type {chatTypes.length >= 6 ? "(Maximum 6)" : ""}
        </Button>}

      <div className="text-sm text-gray-400 mt-2">
        <p>Chat types help your AI system understand the context of a conversation. Each type can:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Direct conversations to different knowledge bases or tools</li>
          <li>Adjust conversation style and format based on purpose</li>
          <li>Enable role-specific responses (e.g., technical vs. creative)</li>
        </ul>
        <p className="mt-3 border-t border-thanos-purple/30 pt-3">The type value will be sent with your query to the webhook. It helps your webhook identify the context of the message.</p>
        <p className="mt-1">Maximum 6 chat types allowed.</p>
      </div>
    </div>;
};

export default ChatTypeSettings;
