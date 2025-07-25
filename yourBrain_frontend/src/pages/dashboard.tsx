import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { CreateContentModal } from "../components/CreateContentModal"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { Sidebar } from "../components/Sidebar"
import { useContent } from "../hooks/useContent"
import { BACKEND_URL } from "../config"
import axios from "axios"

type ContentItem = {
  type: 'twitter' | 'youtube';
  link: string;
  title: string;
};

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const {contents, refresh} = useContent() as { contents: ContentItem[], refresh: () => void };
  const [filterType, setFilterType] = useState<'all' | 'twitter' | 'youtube'>('all');

  useEffect(() => {
    refresh();
  }, [modalOpen])

  return (
    <div>
      <Sidebar onFilterTypeChange={setFilterType} />
      <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
        <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />
        <div className="flex justify-end gap-4">
          <Button onClick={() => setModalOpen(true)} variant="primary" text="Add content" startIcon={<PlusIcon />} />
          <Button onClick={async () => {
              const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                  share: true
              }, {
                  headers: {
                      "Authorization": localStorage.getItem("token")
                  }
              });
              const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
              alert(shareUrl);
          }} variant="secondary" text="Share brain" startIcon={<ShareIcon />} />
        </div>
        <div className="flex gap-4 flex-wrap">
          {(contents || [])
            .filter((item: ContentItem) => filterType === 'all' || item.type === filterType)
            .map(({type, link, title}: ContentItem) => (
              <Card 
                  type={type} 
                  link={link} 
                  title={title} 
              />
            ))}
        </div>
      </div>
    </div>
  );
}